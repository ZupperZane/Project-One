import {
  addDoc,
  collection,
  deleteDoc,
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
  type SavedSiteRecord,
} from "./storage";

interface AddSavedSiteInput {
  userId: string;
  title: string;
  url: string;
}

interface DeleteSavedSiteInput {
  userId: string;
  siteId: string;
}

const toSavedSiteRecord = (
  data: Record<string, unknown>,
  id: string
): SavedSiteRecord => ({
  id,
  userId: typeof data.userId === "string" ? data.userId : "",
  title: typeof data.title === "string" ? data.title : "",
  url: typeof data.url === "string" ? data.url : "",
  createdAt: asString(data.createdAt, now()),
});

export async function addSavedSite(
  input: AddSavedSiteInput
): Promise<SavedSiteRecord> {
  const title = input.title.trim();
  const url = input.url.trim();
  if (!title || !url) throw new Error("Saved site title and URL are required.");

  const firestore = requireDb();
  const userRef = doc(firestore, COLLECTIONS.USERS, input.userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) throw new Error("User not found.");

  const payload = {
    userId: input.userId,
    title,
    url: new URL(url).toString(),
    createdAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(firestore, COLLECTIONS.SAVED_SITES), payload);
  return {
    id: ref.id,
    userId: payload.userId,
    title: payload.title,
    url: payload.url,
    createdAt: now(),
  };
}

export async function deleteSavedSite(
  input: DeleteSavedSiteInput
): Promise<boolean> {
  const firestore = requireDb();
  const siteRef = doc(firestore, COLLECTIONS.SAVED_SITES, input.siteId);
  const siteSnap = await getDoc(siteRef);
  if (!siteSnap.exists()) return false;

  const data = siteSnap.data() as Record<string, unknown>;
  if (data.userId !== input.userId) {
    return false;
  }

  await deleteDoc(siteRef);
  return true;
}

export async function DisplaySavedSites(userId: string): Promise<SavedSiteRecord[]> {
  const firestore = requireDb();
  const snapshots = await getDocs(
    query(collection(firestore, COLLECTIONS.SAVED_SITES), where("userId", "==", userId))
  );

  return snapshots.docs
    .map((snapshot) => mapDoc(snapshot, toSavedSiteRecord))
    .sort(
      (a, b) =>
        (Number.isNaN(Date.parse(b.createdAt)) ? 0 : Date.parse(b.createdAt)) -
        (Number.isNaN(Date.parse(a.createdAt)) ? 0 : Date.parse(a.createdAt))
    );
}
