import { useEffect, useState } from "react";
import { doc, getDocFromServer, setDoc, serverTimestamp } from "firebase/firestore";
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
        // getDocFromServer bypasses the Firestore cache so we always get
        // the latest data, including any manually-set fields like linkedUserId.
        const snap = await getDocFromServer(ref);

        if (snap.exists()) {
          const data = snap.data();
          const profile: UserProfile = {
            uid: (data.uid as string | undefined) ?? user.uid,
            displayName: (data.displayName as string | undefined) ?? user.displayName ?? user.email ?? "User",
            email: (data.email as string | undefined) ?? user.email ?? "",
            role: (data.role as Role | undefined) ?? "primary",
            linkedUserId: (data.linkedUserId as string | null | undefined) ?? null,
          };
          // Persist any defaults we had to fill in (e.g. if doc was created
          // by EnsureUser which doesn't write role/linkedUserId).
          if (!data.role) {
            await setDoc(ref, { role: profile.role }, { merge: true });
          }
          setProfile(profile);
        } else {
          // First-time login: create a minimal profile doc.
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
