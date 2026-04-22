import { useStore, useDispatch } from '../data/store';
import './VoteButton.css';

export default function VoteButton({ interviewId }) {
  const state = useStore();
  const dispatch = useDispatch();
  const count = state.votes[interviewId] || 0;
  const userVote = state.userVotes[interviewId] || null;

  function handleVote(direction) {
    dispatch({ type: 'VOTE', payload: { interviewId, direction } });
  }

  return (
    <div className="vote-button" id={`vote-${interviewId}`}>
      <button
        className={`vote-btn vote-up ${userVote === 'up' ? 'active' : ''}`}
        onClick={() => handleVote('up')}
        aria-label="Upvote"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3l5 7H3l5-7z" fill="currentColor"/>
        </svg>
      </button>
      <span className={`vote-count ${count > 0 ? 'positive' : count < 0 ? 'negative' : ''}`}>
        {count}
      </span>
      <button
        className={`vote-btn vote-down ${userVote === 'down' ? 'active' : ''}`}
        onClick={() => handleVote('down')}
        aria-label="Downvote"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 13l5-7H3l5 7z" fill="currentColor"/>
        </svg>
      </button>
    </div>
  );
}
