import type { QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase.config";

export const COLLECTIONS = {
  USERS: "Users",
  EVENTS: "Events",
  MESSAGES: "Messages",
  LIST_ITEMS: "ListItems",
  SAVED_SITES: "SavedSites",
} as const;

export interface EventRecord {
  id: string;
  name: string;
  day: string;
  startAt: string | null;
  notes: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageRecord {
  id: string;
  fromUserId: string;
  toUserId: string;
  body: string;
  createdAt: string;
}

export interface ListItemRecord {
  id: string;
  userId: string;
  listName: string;
  text: string;
  day: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SavedSiteRecord {
  id: string;
  userId: string;
  title: string;
  url: string;
  createdAt: string;
}

export interface UserRecord {
  id: string;
  externalId?: string;
  email: string;
  displayName: string;
  connectedUserIds: string[];
  relations: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export const now = () => new Date().toISOString();

export const todayKey = () => now().slice(0, 10);

export const normalizeDay = (day?: string) => {
  if (!day) return todayKey();

  const trimmed = day.trim();
  if (!trimmed) return todayKey();

  return trimmed.slice(0, 10);
};

export const createId = (prefix: string) => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }

  return `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now()}`;
};

export const requireDb = () => {
  if (!db) {
    throw new Error(
      "Firestore is not configured. Set Firebase config before using backend handlers."
    );
  }

  return db;
};

export const asString = (value: unknown, fallback = "") => {
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  if (value && typeof value === "object") {
    const timestampLike = value as { toDate?: unknown };
    if (typeof timestampLike.toDate === "function") {
      try {
        const dateValue = (timestampLike.toDate as () => Date).call(value);
        if (dateValue instanceof Date) return dateValue.toISOString();
      } catch {
        return fallback;
      }
    }
  }

  return fallback;
};

export const mapDoc = <T extends { id: string }>(
  snapshot: QueryDocumentSnapshot,
  mapper: (data: Record<string, unknown>, id: string) => T
): T => mapper(snapshot.data() as Record<string, unknown>, snapshot.id);
