import { initializeApp } from "firebase/app"; // firebase core
import { getFirestore } from "firebase/firestore"; // firestore
import { getAuth } from "firebase/auth"; // authentication

// firebase configuration from env variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// initialize firebase app
const app = initializeApp(firebaseConfig);

// export firestore database
export const db = getFirestore(app);

// ✅ export authentication instance
export const auth = getAuth(app);

