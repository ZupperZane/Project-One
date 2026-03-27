import { createContext } from "react";
import type { UserProfile } from "../hooks/useUserProfile";

export interface ActiveProfileContextValue {
  activeUserId: string | null;
  isViewingLinked: boolean;
  ownProfile: UserProfile | null;
  linkedProfile: UserProfile | null;
  canToggle: boolean;
  toggle: () => void;
  loading: boolean;
}

export const ActiveProfileContext = createContext<ActiveProfileContextValue>({
  activeUserId: null,
  isViewingLinked: false,
  ownProfile: null,
  linkedProfile: null,
  canToggle: false,
  toggle: () => {},
  loading: true,
});
