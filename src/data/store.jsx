import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { db } from './firebase';
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  increment,
  serverTimestamp,
} from 'firebase/firestore';

const StoreContext = createContext(null);
const DispatchContext = createContext(null);

// Per-user vote tracking (no auth, so localStorage)
const USER_VOTES_KEY = 'interviewshare_uservotes';

function loadUserVotes() {
  try {
    return JSON.parse(localStorage.getItem(USER_VOTES_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveUserVotes(votes) {
  localStorage.setItem(USER_VOTES_KEY, JSON.stringify(votes));
}

export function StoreProvider({ children }) {
  const [interviews, setInterviews] = useState([]);
  const [comments, setComments] = useState({});
  const [votes, setVotes] = useState({});
  const [userVotes, setUserVotes] = useState(loadUserVotes);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userVotesRef = useRef(userVotes);

  // Keep ref in sync
  useEffect(() => {
    userVotesRef.current = userVotes;
  }, [userVotes]);

  // ─── Real-time listener: interviews ────────────────────────────────
  useEffect(() => {
    const q = query(collection(db, 'interviews'), orderBy('createdAt', 'desc'));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => {
          const raw = d.data();
          return {
            ...raw,
            id: d.id,
            createdAt: raw.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            updatedAt: raw.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          };
        });

        setInterviews(data);

        // Extract vote counts
        const v = {};
        data.forEach((d) => {
          v[d.id] = d.voteCount || 0;
        });
        setVotes(v);
        setLoading(false);
      },
      (err) => {
        console.error('Firestore interviews listener error:', err);
        setError('Failed to load interviews. Please try again.');
        setLoading(false);
      }
    );

    return unsub;
  }, []);

  // ─── Real-time listener: comments ──────────────────────────────────
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'comments'),
      (snapshot) => {
        const grouped = {};
        snapshot.docs.forEach((d) => {
          const raw = d.data();
          const comment = {
            ...raw,
            id: d.id,
            createdAt: raw.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          };
          if (!grouped[comment.interviewId]) grouped[comment.interviewId] = [];
          grouped[comment.interviewId].push(comment);
        });

        // Sort each group by date
        Object.keys(grouped).forEach((key) => {
          grouped[key].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        });

        setComments(grouped);
      },
      (err) => {
        console.error('Firestore comments listener error:', err);
      }
    );

    return unsub;
  }, []);

  // ─── State object ──────────────────────────────────────────────────
  const state = { interviews, comments, votes, userVotes, loading, error };

  // ─── Dispatch (writes to Firestore) ────────────────────────────────
  const dispatch = useCallback(async (action) => {
    try {
      switch (action.type) {
        case 'ADD_INTERVIEW': {
          const payload = { ...action.payload };
          // Remove any client-generated id
          delete payload.id;
          await addDoc(collection(db, 'interviews'), {
            ...payload,
            voteCount: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          break;
        }

        case 'VOTE': {
          const { interviewId, direction } = action.payload;
          const currentVote = userVotesRef.current[interviewId] || null;
          let delta = 0;

          if (direction === currentVote) {
            // Undo vote
            delta = direction === 'up' ? -1 : 1;
            const newVotes = { ...userVotesRef.current, [interviewId]: null };
            setUserVotes(newVotes);
            saveUserVotes(newVotes);
          } else {
            if (currentVote === 'up') delta = -1;
            if (currentVote === 'down') delta = 1;
            delta += direction === 'up' ? 1 : -1;
            const newVotes = { ...userVotesRef.current, [interviewId]: direction };
            setUserVotes(newVotes);
            saveUserVotes(newVotes);
          }

          // Atomic update in Firestore
          const ref = doc(db, 'interviews', interviewId);
          await updateDoc(ref, { voteCount: increment(delta) });
          break;
        }

        case 'ADD_COMMENT': {
          const { interviewId, text, author, parentId } = action.payload;
          await addDoc(collection(db, 'comments'), {
            interviewId,
            text,
            author: author || 'Anonymous',
            parentId: parentId || null,
            createdAt: serverTimestamp(),
            votes: 0,
          });
          break;
        }

        case 'DELETE_INTERVIEW': {
          await deleteDoc(doc(db, 'interviews', action.payload));
          break;
        }

        default:
          break;
      }
    } catch (err) {
      console.error('Dispatch error:', err);
    }
  }, []);

  return (
    <StoreContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be inside StoreProvider');
  return ctx;
}

export function useDispatch() {
  const ctx = useContext(DispatchContext);
  if (!ctx) throw new Error('useDispatch must be inside StoreProvider');
  return ctx;
}

/* ─── Selectors (unchanged API) ─────────────────────────────────────── */

export function getInterviewsByCompany(state, companySlug) {
  return state.interviews.filter((i) => i.companySlug === companySlug);
}

export function getInterviewById(state, id) {
  return state.interviews.find((i) => i.id === id) || null;
}

export function getCompaniesWithInterviews(state) {
  const map = {};
  state.interviews.forEach((i) => {
    if (!map[i.companySlug]) {
      map[i.companySlug] = {
        slug: i.companySlug,
        name: i.companyName,
        domain: i.companyDomain,
        count: 0,
        totalDifficulty: 0,
        tags: new Set(),
      };
    }
    map[i.companySlug].count++;
    map[i.companySlug].totalDifficulty += i.difficulty;
    (i.tags || []).forEach((t) => map[i.companySlug].tags.add(t));
  });

  return Object.values(map).map((c) => ({
    ...c,
    avgDifficulty: c.count > 0 ? (c.totalDifficulty / c.count).toFixed(1) : 0,
    tags: Array.from(c.tags).slice(0, 5),
  }));
}

export function searchInterviews(state, query) {
  if (!query || !query.trim()) return state.interviews;
  const q = query.toLowerCase().trim();
  return state.interviews.filter(
    (i) =>
      i.companyName.toLowerCase().includes(q) ||
      i.role.toLowerCase().includes(q) ||
      (i.questions || []).some((qn) => qn.toLowerCase().includes(q)) ||
      (i.tips || '').toLowerCase().includes(q) ||
      (i.tags || []).some((t) => t.toLowerCase().includes(q))
  );
}
