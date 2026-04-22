// ─── Firebase Configuration ──────────────────────────────────────────
//
// To change these, update the values below or set VITE_FB_* env vars.
// Firebase config keys are safe to expose publicly — security comes
// from Firestore rules, not from hiding these values.
//

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FB_API_KEY            || "AIzaSyAwkFHiueCHvIw7CO9IoJJSyI8oqis2Uu8",
  authDomain:        import.meta.env.VITE_FB_AUTH_DOMAIN        || "interviewshare-8d939.firebaseapp.com",
  projectId:         import.meta.env.VITE_FB_PROJECT_ID         || "interviewshare-8d939",
  storageBucket:     import.meta.env.VITE_FB_STORAGE_BUCKET     || "interviewshare-8d939.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FB_MESSAGING_ID       || "825398114074",
  appId:             import.meta.env.VITE_FB_APP_ID             || "1:825398114074:web:c61352d15312c39e159ea3",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
