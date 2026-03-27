import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth, hasFirebaseConfig } from "../firebase/firebase.config";
import { AuthContext } from "./AuthContext";

const googleProvider = new GoogleAuthProvider();

const authNotConfiguredError = () =>
  Promise.reject(
    new Error(
      "Firebase Auth is not configured. Set VITE_FIREBASE_* environment variables."
    )
  );

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(Boolean(auth));

  const createUser = (email: string, password: string) => {
    if (!auth) return authNotConfiguredError();
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password).finally(() =>
      setLoading(false)
    );
  };

  const signInUser = (email: string, password: string) => {
    if (!auth) return authNotConfiguredError();
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password).finally(() =>
      setLoading(false)
    );
  };

  const resetUserPassword = (email: string) => {
    if (!auth) return authNotConfiguredError();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      return Promise.reject(new Error("Email is required for password reset."));
    }

    return sendPasswordResetEmail(auth, normalizedEmail);
  };

  const signInWithGoogle = () => {
    if (!auth) return authNotConfiguredError();
    setLoading(true);
    return signInWithPopup(auth, googleProvider).finally(() => setLoading(false));
  };

  const signOutUser = () => {
    if (!auth) return authNotConfiguredError();
    setLoading(true);
    return signOut(auth).finally(() => setLoading(false));
  };

  const updateUserProfile = (profile: { displayName?: string; photoURL?: string }) => {
    if (!auth) return authNotConfiguredError();
    if (!auth.currentUser) {
      return Promise.reject(new Error("No authenticated user to update."));
    }

    return updateProfile(auth.currentUser, profile);
  };

  useEffect(() => {
    if (!auth) return undefined;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    createUser,
    signInUser,
    resetUserPassword,
    signInWithGoogle,
    signOutUser,
    updateUserProfile,
    user,
    loading,
    firebaseConfigured: hasFirebaseConfig,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
