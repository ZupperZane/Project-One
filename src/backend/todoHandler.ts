import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  COLLECTIONS,
  asString,
  mapDoc,
  normalizeDay,
  now,
  requireDb,
  type EventRecord,
  type ListItemRecord,
} from "./storage";
import { displayCalendar as displayCalendarEvents } from "./eventHandler";

interface AddToListInput {
  userId: string;
  listName: string;
  text: string;
  day?: string;
}

interface DeleteFromListInput {
  userId: string;
  listName: string;
  itemId: string;
}

interface EditFromListInput {
  userId: string;
  listName: string;
  itemId: string;
  text?: string;
  completed?: boolean;
  day?: string;
}

const normalizeListName = (listName: string) => listName.trim().toLowerCase();

const toListItemRecord = (
  data: Record<string, unknown>,
  id: string
): ListItemRecord => ({
  id,
  userId: typeof data.userId === "string" ? data.userId : "",
  listName: typeof data.listName === "string" ? data.listName : "default",
  text: typeof data.text === "string" ? data.text : "",
  day: normalizeDay(typeof data.day === "string" ? data.day : undefined),
  completed: typeof data.completed === "boolean" ? data.completed : false,
  sharedWith: Array.isArray(data.sharedWith)
    ? data.sharedWith.filter((s): s is string => typeof s === "string")
    : [],
  createdAt: asString(data.createdAt, now()),
  updatedAt: asString(data.updatedAt, now()),
});

export async function addToList(input: AddToListInput): Promise<ListItemRecord> {
  const text = input.text.trim();
  if (!text) throw new Error("List item text is required.");

  const firestore = requireDb();
  const listName = normalizeListName(input.listName);
  if (!listName) throw new Error("List name is required.");

  const userRef = doc(firestore, COLLECTIONS.USERS, input.userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) throw new Error("User not found.");

  const timestamp = now();
  const payload = {
    userId: input.userId,
    listName,
    text,
    day: normalizeDay(input.day),
    completed: false,
    sharedWith: [] as string[],
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(firestore, COLLECTIONS.LIST_ITEMS), payload);
  return {
    id: ref.id,
    userId: input.userId,
    listName,
    text,
    day: normalizeDay(input.day),
    completed: false,
    sharedWith: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export async function shareTask(taskId: string, targetUserId: string): Promise<boolean> {
  const firestore = requireDb();
  const itemRef = doc(firestore, COLLECTIONS.LIST_ITEMS, taskId);
  const snap = await getDoc(itemRef);
  if (!snap.exists()) return false;
  await updateDoc(itemRef, { sharedWith: arrayUnion(targetUserId), updatedAt: serverTimestamp() });
  return true;
}

export async function deleteFromList(input: DeleteFromListInput): Promise<boolean> {
  const firestore = requireDb();
  const itemRef = doc(firestore, COLLECTIONS.LIST_ITEMS, input.itemId);
  const itemSnap = await getDoc(itemRef);
  if (!itemSnap.exists()) return false;

  const data = itemSnap.data() as Record<string, unknown>;
  const listName = normalizeListName(input.listName);

  if (data.userId !== input.userId || data.listName !== listName) {
    return false;
  }

  await deleteDoc(itemRef);
  return true;
}

export async function editFromList(
  input: EditFromListInput
): Promise<ListItemRecord> {
  const firestore = requireDb();
  const itemRef = doc(firestore, COLLECTIONS.LIST_ITEMS, input.itemId);
  const itemSnap = await getDoc(itemRef);
  if (!itemSnap.exists()) throw new Error("List item not found.");

  const existing = itemSnap.data() as Record<string, unknown>;
  const listName = normalizeListName(input.listName);
  if (existing.userId !== input.userId || existing.listName !== listName) {
    throw new Error("You do not have permission to edit this list item.");
  }

  const updates: Record<string, unknown> = { updatedAt: serverTimestamp() };

  if (typeof input.text === "string") {
    const nextText = input.text.trim();
    if (!nextText) throw new Error("List item text cannot be empty.");
    updates.text = nextText;
  }

  if (typeof input.completed === "boolean") {
    updates.completed = input.completed;
  }

  if (typeof input.day === "string") {
    updates.day = normalizeDay(input.day);
  }

  await updateDoc(itemRef, updates);

  const next = await getDoc(itemRef);
  return toListItemRecord(next.data() as Record<string, unknown>, next.id);
}

export async function displayList(
  day: string,
  userId: string,
  listName = "default"
): Promise<ListItemRecord[]> {
  const firestore = requireDb();
  const normalizedListName = normalizeListName(listName);
  const dayKey = normalizeDay(day);
  const itemsRef = collection(firestore, COLLECTIONS.LIST_ITEMS);

  const [ownSnapshots, sharedSnapshots] = await Promise.all([
    getDocs(query(itemsRef, where("userId", "==", userId))),
    getDocs(query(itemsRef, where("sharedWith", "array-contains", userId))),
  ]);

  const map = new Map<string, ListItemRecord>();
  for (const snapshot of [...ownSnapshots.docs, ...sharedSnapshots.docs]) {
    map.set(snapshot.id, mapDoc(snapshot, toListItemRecord));
  }

  return [...map.values()]
    .filter((item) => item.listName === normalizedListName && item.day === dayKey)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function displayCalendarFromList(day: string, userId?: string): Promise<EventRecord[]> {
  return displayCalendarEvents(day, userId);
}

export { displayCalendarFromList as displayCalendar };
