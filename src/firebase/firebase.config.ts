import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import type { Auth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBYjKMVNVgpZuG2Gz4BBvOpLW19zUnTSL8",
  authDomain: "project-1-a1096.firebaseapp.com",
  projectId: "project-1-a1096",
  storageBucket: "project-1-a1096.firebasestorage.app",
  messagingSenderId: "739905989253",
  appId: "1:739905989253:web:7c490f0f1904a1bdee57ec"
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
