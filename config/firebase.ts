import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let app;
let auth;
let googleProvider;
let githubProvider;

try {
  app = initializeApp(firebaseConfig);

  // Initialize Firebase Authentication
  auth = getAuth(app);

  // Configure auth providers
  googleProvider = new GoogleAuthProvider();
  githubProvider = new GithubAuthProvider();

  // Configure settings
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Create dummy exports to prevent module loading errors
  auth = null as any;
  googleProvider = null as any;
  githubProvider = null as any;
}

export { auth, googleProvider, githubProvider };
export default app;
