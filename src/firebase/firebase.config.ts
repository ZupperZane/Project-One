import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import type { Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";

const firebaseConfig = {
apiKey: "AIzaSyDyiseMS7y6D6CantfHmOgYVX1iM1JFE7o",
  authDomain: "test-93446.firebaseapp.com",
  projectId: "test-93446",
  storageBucket: "test-93446.firebasestorage.app",
  messagingSenderId: "348490248132",
  appId: "1:348490248132:web:8e584840930b560bf23e91"
};

const requiredKeys: Array<keyof typeof firebaseConfig> = [
  "apiKey",
  "authDomain",
  "projectId",
  "appId",
];

export const hasFirebaseConfig = requiredKeys.every((key) =>
  Boolean(firebaseConfig[key])
);

export const app = hasFirebaseConfig ? initializeApp(firebaseConfig) : null;
export const auth: Auth | null = app ? getAuth(app) : null;
export const db: Firestore | null = app ? getFirestore(app) : null;
