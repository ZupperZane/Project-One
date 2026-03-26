import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import {
  COLLECTIONS,
  asString,
  mapDoc,
  now,
  requireDb,
  type MessageRecord,
} from "./storage";

interface SendMessageInput {
  fromUserId: string;
  toUserId: string;
  body: string;
}

const toMessageRecord = (
  data: Record<string, unknown>,
  id: string
): MessageRecord => ({
  id,
  fromUserId: typeof data.fromUserId === "string" ? data.fromUserId : "",
  toUserId: typeof data.toUserId === "string" ? data.toUserId : "",
  body: typeof data.body === "string" ? data.body : "",
  createdAt: asString(data.createdAt, now()),
});

export async function SendMessage(input: SendMessageInput): Promise<MessageRecord> {
  const body = input.body.trim();
  if (!body) throw new Error("Message body is required.");

  const firestore = requireDb();
  const fromUser = await getDoc(doc(firestore, COLLECTIONS.USERS, input.fromUserId));
  const toUser = await getDoc(doc(firestore, COLLECTIONS.USERS, input.toUserId));
  if (!fromUser.exists() || !toUser.exists()) {
    throw new Error("Both sender and recipient users must exist before messaging.");
  }

  const payload = {
    fromUserId: input.fromUserId,
    toUserId: input.toUserId,
    body,
    createdAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(firestore, COLLECTIONS.MESSAGES), payload);
  return { id: ref.id, fromUserId: input.fromUserId, toUserId: input.toUserId, body, createdAt: now() };
}

export async function DisplayMessages(userId: string): Promise<MessageRecord[]> {
  const firestore = requireDb();
  const messagesRef = collection(firestore, COLLECTIONS.MESSAGES);

  const [sentSnapshots, receivedSnapshots] = await Promise.all([
    getDocs(query(messagesRef, where("fromUserId", "==", userId))),
    getDocs(query(messagesRef, where("toUserId", "==", userId))),
  ]);

  const map = new Map<string, MessageRecord>();

  for (const snapshot of [...sentSnapshots.docs, ...receivedSnapshots.docs]) {
    map.set(snapshot.id, mapDoc(snapshot, toMessageRecord));
  }

  return [...map.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}
