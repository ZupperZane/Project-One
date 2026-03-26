import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
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
} from "./storage";

interface CreateEventInput {
  name: string;
  day?: string;
  startAt?: string | null;
  notes?: string;
  createdBy?: string;
}

interface EditEventInput {
  name?: string;
  day?: string;
  startAt?: string | null;
  notes?: string;
}

const toEventRecord = (data: Record<string, unknown>, id: string): EventRecord => ({
  id,
  name: typeof data.name === "string" ? data.name : "Untitled Event",
  day: normalizeDay(typeof data.day === "string" ? data.day : undefined),
  startAt: typeof data.startAt === "string" ? data.startAt : null,
  notes: typeof data.notes === "string" ? data.notes : "",
  createdBy: typeof data.createdBy === "string" ? data.createdBy : "system",
  createdAt: asString(data.createdAt, now()),
  updatedAt: asString(data.updatedAt, now()),
});

const sortByNewest = (events: EventRecord[]) =>
  events.sort(
    (a, b) =>
      (Number.isNaN(Date.parse(b.createdAt)) ? 0 : Date.parse(b.createdAt)) -
      (Number.isNaN(Date.parse(a.createdAt)) ? 0 : Date.parse(a.createdAt))
  );

let seeded = false;

const seedDummyEvents = async () => {
  if (seeded) return;

  const firestore = requireDb();
  const eventsRef = collection(firestore, COLLECTIONS.EVENTS);
  const existing = await getDocs(query(eventsRef, limit(1)));
  if (!existing.empty) {
    seeded = true;
    return;
  }

  const timestamp = now();
  const day = normalizeDay(timestamp);

  await Promise.all(
    [1, 2, 3].map((index) =>
      addDoc(eventsRef, {
        name: `Dummy Event ${index}`,
        day,
        startAt: null,
        notes: "",
        createdBy: "system",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
    )
  );

  seeded = true;
};

export async function CreateEvent(input: CreateEventInput): Promise<EventRecord> {
  const name = input.name.trim();
  if (!name) throw new Error("Event name is required.");

  const firestore = requireDb();
  const timestamp = now();
  const payload = {
    name,
    day: normalizeDay(input.day ?? input.startAt ?? undefined),
    startAt: input.startAt ?? null,
    notes: input.notes?.trim() ?? "",
    createdBy: input.createdBy?.trim() || "system",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(firestore, COLLECTIONS.EVENTS), payload);
  return {
    id: ref.id,
    name: payload.name,
    day: payload.day,
    startAt: payload.startAt,
    notes: payload.notes,
    createdBy: payload.createdBy,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export async function DeleteEvent(eventId: string): Promise<boolean> {
  const firestore = requireDb();
  const eventRef = doc(firestore, COLLECTIONS.EVENTS, eventId);
  const existing = await getDoc(eventRef);
  if (!existing.exists()) return false;

  await deleteDoc(eventRef);
  return true;
}

export async function EditEvent(
  eventId: string,
  changes: EditEventInput
): Promise<EventRecord> {
  const firestore = requireDb();
  const eventRef = doc(firestore, COLLECTIONS.EVENTS, eventId);
  const existing = await getDoc(eventRef);
  if (!existing.exists()) throw new Error("Event not found.");

  const updates: Record<string, unknown> = { updatedAt: serverTimestamp() };

  if (typeof changes.name === "string") {
    const nextName = changes.name.trim();
    if (!nextName) throw new Error("Event name cannot be empty.");
    updates.name = nextName;
  }

  if (typeof changes.day === "string") {
    updates.day = normalizeDay(changes.day);
  }

  if (typeof changes.startAt !== "undefined") {
    updates.startAt = changes.startAt;
  }

  if (typeof changes.notes === "string") {
    updates.notes = changes.notes.trim();
  }

  await updateDoc(eventRef, updates);
  const next = await getDoc(eventRef);

  return toEventRecord(next.data() as Record<string, unknown>, next.id);
}

export async function DisplayCalender(day?: string): Promise<EventRecord[]> {
  await seedDummyEvents();

  const firestore = requireDb();
  const dayKey = normalizeDay(day);
  const eventsRef = collection(firestore, COLLECTIONS.EVENTS);
  const snapshots = await getDocs(query(eventsRef, where("day", "==", dayKey)));

  return snapshots.docs
    .map((snapshot) => mapDoc(snapshot, toEventRecord))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function ListEvents(): Promise<EventRecord[]> {
  await seedDummyEvents();

  const firestore = requireDb();
  const snapshots = await getDocs(collection(firestore, COLLECTIONS.EVENTS));

  return sortByNewest(snapshots.docs.map((snapshot) => mapDoc(snapshot, toEventRecord)));
}
