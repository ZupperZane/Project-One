import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { doc, getDocFromServer } from "firebase/firestore";
import { db } from "../firebase/firebase.config";
import { useUserProfile } from "../hooks/useUserProfile";
import type { UserProfile } from "../hooks/useUserProfile";
import { ROLES } from "../utils/constants";
import { ActiveProfileContext } from "./ActiveProfileContext";

interface ActiveProfileProviderProps {
  children: ReactNode;
}

function ActiveProfileProvider({ children }: ActiveProfileProviderProps) {
  const { profile: ownProfile, loading: profileLoading } = useUserProfile();
  const [linkedProfile, setLinkedProfile] = useState<UserProfile | null>(null);
  const [linkedLoading, setLinkedLoading] = useState(false);
  const [isViewingLinked, setIsViewingLinked] = useState(false);

  useEffect(() => {
    if (!ownProfile?.linkedUserId || !db) {
      setLinkedProfile(null);
      return;
    }

    const fetchLinked = async () => {
      setLinkedLoading(true);
      try {
        const linkedUid = ownProfile.linkedUserId!;
        const snap = await getDocFromServer(doc(db!, "Users", linkedUid));
        if (snap.exists()) {
          const data = snap.data();
          setLinkedProfile({
            uid: (data.uid as string | undefined) ?? linkedUid,
            displayName: (data.displayName as string | undefined) ?? "User",
            email: (data.email as string | undefined) ?? "",
            role: (data.role as UserProfile["role"] | undefined) ?? "primary",
            linkedUserId: (data.linkedUserId as string | null | undefined) ?? null,
          });
        }
      } catch (err) {
        console.error("Failed to load linked user profile", err);
      } finally {
        setLinkedLoading(false);
      }
    };

    void fetchLinked();
  }, [ownProfile?.linkedUserId]);

  // Reset toggle on logout
  useEffect(() => {
    if (!ownProfile) setIsViewingLinked(false);
  }, [ownProfile]);

  const canToggle =
    ownProfile?.role === ROLES.SUPPORTIVE && linkedProfile !== null;

  const toggle = () => {
    if (canToggle) setIsViewingLinked((prev) => !prev);
  };

  const activeUserId =
    isViewingLinked && linkedProfile
      ? linkedProfile.uid
      : (ownProfile?.uid ?? null);

  return (
    <ActiveProfileContext.Provider
      value={{
        activeUserId,
        isViewingLinked,
        ownProfile,
        linkedProfile,
        canToggle,
        toggle,
        loading: profileLoading || linkedLoading,
      }}
    >
      {children}
    </ActiveProfileContext.Provider>
  );
}

export default ActiveProfileProvider;
