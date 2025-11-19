import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../config/firebase';

interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthStore {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;

  // Actions
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Auth methods
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;

  // Initialize auth state listener
  initialize: () => void;
}

const mapFirebaseUser = (firebaseUser: FirebaseUser): AuthUser => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email,
  displayName: firebaseUser.displayName,
  photoURL: firebaseUser.photoURL,
});

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      error: null,

      setUser: (user) => set({ user, loading: false }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      signInWithGoogle: async () => {
        set({ loading: true, error: null });
        try {
          const result = await signInWithPopup(auth, googleProvider);
          set({ user: mapFirebaseUser(result.user), loading: false });
        } catch (error: any) {
          console.error('Google sign in error:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      signInWithGithub: async () => {
        set({ loading: true, error: null });
        try {
          const result = await signInWithPopup(auth, githubProvider);
          set({ user: mapFirebaseUser(result.user), loading: false });
        } catch (error: any) {
          console.error('Github sign in error:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      signInWithEmail: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const result = await signInWithEmailAndPassword(auth, email, password);
          set({ user: mapFirebaseUser(result.user), loading: false });
        } catch (error: any) {
          console.error('Email sign in error:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      signUpWithEmail: async (email: string, password: string, displayName: string) => {
        set({ loading: true, error: null });
        try {
          const result = await createUserWithEmailAndPassword(auth, email, password);

          // Update profile with display name
          await updateProfile(result.user, { displayName });

          set({ user: mapFirebaseUser(result.user), loading: false });
        } catch (error: any) {
          console.error('Email sign up error:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      signOut: async () => {
        set({ loading: true, error: null });
        try {
          await firebaseSignOut(auth);
          set({ user: null, loading: false });
        } catch (error: any) {
          console.error('Sign out error:', error);
          set({ error: error.message, loading: false });
          throw error;
        }
      },

      initialize: () => {
        try {
          if (!auth) {
            console.warn('Firebase auth not initialized, skipping auth state listener');
            set({ user: null, loading: false });
            return;
          }

          onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
              set({ user: mapFirebaseUser(firebaseUser), loading: false });
            } else {
              set({ user: null, loading: false });
            }
          });
        } catch (error) {
          console.error('Error initializing auth state listener:', error);
          set({ user: null, loading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

// Initialize auth state listener on module load
useAuthStore.getState().initialize();
