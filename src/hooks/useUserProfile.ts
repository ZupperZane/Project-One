import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import useAuth from "./useAuth";
import type { Role } from "../utils/constants";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: Role;
  linkedUserId: string | null;
}

interface UseUserProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export function useUserProfile(): UseUserProfileReturn {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !db) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const ref = doc(db!, "Users", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setProfile(snap.data() as UserProfile);
        } else {
          // First-time login: create a minimal profile doc.
          // Role defaults to "primary" — Zane/admin should set the correct
          // role and linkedUserId in the Firebase console after account creation.
          const newProfile: UserProfile = {
            uid: user.uid,
            displayName: user.displayName ?? user.email ?? "User",
            email: user.email ?? "",
            role: "primary",
            linkedUserId: null,
          };
          await setDoc(ref, { ...newProfile, createdAt: serverTimestamp() });
          setProfile(newProfile);
        }
      } catch (err) {
        setError("Failed to load user profile.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  return { profile, loading, error };
}
