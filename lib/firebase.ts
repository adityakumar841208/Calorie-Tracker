// firebase.ts
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Prefer importing env vars via @env (react-native-dotenv). This is configured
// in babel.config.js. For web or other runtimes you can also set the
// corresponding process.env.* values.
// Attempt to load @env at runtime (react-native-dotenv). Use a dynamic
// require so TypeScript/ESLint won't try to statically resolve the module.
import {
    FIREBASE_API_KEY,
    FIREBASE_APP_ID,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
} from '@env';

const apiKey = FIREBASE_API_KEY || process.env.FIREBASE_API_KEY;
const authDomain = FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN;
const projectId = FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
const storageBucket = FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET;
const messagingSenderId = FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID;
const appId = FIREBASE_APP_ID || process.env.FIREBASE_APP_ID;

if (!apiKey) {
  // If the API key is missing, warn but don't throw — throwing during module
  // initialization prevents the whole app from mounting (shows Expo default
  // landing page). During development it's more convenient to allow the app
  // to run and handle auth calls later.
  // Be sure to set FIREBASE_API_KEY in your `.env` (or process.env) for
  // production or to enable auth features.
   
  console.warn(
    'Missing Firebase API key. Set FIREBASE_API_KEY in .env or process.env to enable Firebase features.'
  );
}

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

// avoid re-initializing
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export default app;
