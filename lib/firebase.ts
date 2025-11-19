import Constants from 'expo-constants';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth, sendPasswordResetEmail} from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

// Firebase configuration from app.json extra field
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
  appId: Constants.expoConfig?.extra?.firebaseAppId,
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Auth - Firebase automatically uses AsyncStorage in React Native
const auth: Auth = getAuth(app);

// Initialize Firestore (though you're using MongoDB, keeping it for future use)
// Note: Not actively used, so Firestore permissions shouldn't affect your app
const db: Firestore = getFirestore(app);

// forget password
const forgetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

export { auth, db, forgetPassword };
export default app;

