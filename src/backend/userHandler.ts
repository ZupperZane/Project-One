import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";
import {
  COLLECTIONS,
  asString,
  now,
  requireDb,
  type UserRecord,
} from "./storage";

interface SignupInput {
  email: string;
  password: string;
  displayName?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface ConnectUsersInput {
  userId: string;
  targetUserId: string;
  relationToTarget?: string;
  relationToUser?: string;
}

interface EnsureUserInput {
  externalId: string;
  email?: string;
  displayName?: string;
}

interface UpdateDisplayNameInput {
  userId: string;
  displayName: string;
  email?: string;
}

const mapUser = (id: string, data: Record<string, unknown>): UserRecord => ({
  id,
  externalId: asString(data.externalId, id),
  email: asString(data.email, `${id}@local.user`),
  displayName: asString(data.displayName, "User"),
  connectedUserIds: Array.isArray(data.connectedUserIds)
    ? data.connectedUserIds.filter((entry): entry is string => typeof entry === "string")
    : [],
  relations:
    data.relations && typeof data.relations === "object"
      ? Object.fromEntries(
          Object.entries(data.relations).filter(
            ([, value]) => typeof value === "string"
          ) as Array<[string, string]>
        )
      : {},
  createdAt: asString(data.createdAt, now()),
  updatedAt: asString(data.updatedAt, now()),
});

const ensureAuth = () => {
  if (!auth) {
    throw new Error(
      "Firebase Auth is not configured. Set Firebase config before using Signup/Login handlers."
    );
  }

  return auth;
};

export async function EnsureUser(input: EnsureUserInput): Promise<UserRecord> {
  const firestore = requireDb();
  const userRef = doc(firestore, COLLECTIONS.USERS, input.externalId);
  const existing = await getDoc(userRef);

  if (existing.exists()) {
    const data = existing.data() as Record<string, unknown>;

    const updates: Record<string, unknown> = {};
    if (input.email && !data.email) updates.email = input.email.trim().toLowerCase();
    if (input.displayName && !data.displayName) updates.displayName = input.displayName.trim();
    if (Object.keys(updates).length > 0) {
      updates.updatedAt = serverTimestamp();
      await updateDoc(userRef, updates);
    }

    const refreshed = await getDoc(userRef);
    return mapUser(refreshed.id, refreshed.data() as Record<string, unknown>);
  }

  const payload = {
    externalId: input.externalId,
    email: input.email?.trim().toLowerCase() || `${input.externalId}@local.user`,
    displayName: input.displayName?.trim() || "User",
    connectedUserIds: [] as string[],
    relations: {} as Record<string, string>,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(userRef, payload);
  return mapUser(input.externalId, payload);
}

export async function UpdateUserDisplayName(
  input: UpdateDisplayNameInput
): Promise<UserRecord> {
  const userId = input.userId.trim();
  const displayName = input.displayName.trim();
  if (!userId) throw new Error("User ID is required.");
  if (!displayName) throw new Error("Display name is required.");

  const firestore = requireDb();
  const userRef = doc(firestore, COLLECTIONS.USERS, userId);
  const existing = await getDoc(userRef);

  if (!existing.exists()) {
    const payload = {
      externalId: userId,
      email: input.email?.trim().toLowerCase() || `${userId}@local.user`,
      displayName,
      connectedUserIds: [] as string[],
      relations: {} as Record<string, string>,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(userRef, payload);
    return mapUser(userId, payload);
  }

  const updates: Record<string, unknown> = {
    displayName,
    updatedAt: serverTimestamp(),
  };
  if (input.email?.trim()) {
    updates.email = input.email.trim().toLowerCase();
  }

  await updateDoc(userRef, updates);
  const refreshed = await getDoc(userRef);
  return mapUser(refreshed.id, refreshed.data() as Record<string, unknown>);
}

export async function Signup(input: SignupInput): Promise<UserRecord> {
  const firebaseAuth = ensureAuth();
  const email = input.email.trim().toLowerCase();
  const password = input.password.trim();
  if (!email || !password) throw new Error("Email and password are required.");

  const credentials = await createUserWithEmailAndPassword(firebaseAuth, email, password);
  return EnsureUser({
    externalId: credentials.user.uid,
    email: credentials.user.email ?? email,
    displayName: input.displayName ?? credentials.user.displayName ?? undefined,
  });
}

export async function Login(input: LoginInput): Promise<UserRecord> {
  const firebaseAuth = ensureAuth();
  const email = input.email.trim().toLowerCase();
  const password = input.password.trim();

  const credentials = await signInWithEmailAndPassword(firebaseAuth, email, password);
  return EnsureUser({
    externalId: credentials.user.uid,
    email: credentials.user.email ?? email,
    displayName: credentials.user.displayName ?? undefined,
  });
}

export async function ConnectUsers(input: ConnectUsersInput): Promise<UserRecord[]> {
  if (input.userId === input.targetUserId) {
    throw new Error("A user cannot connect to themselves.");
  }

  const firestore = requireDb();
  const userRef = doc(firestore, COLLECTIONS.USERS, input.userId);
  const targetRef = doc(firestore, COLLECTIONS.USERS, input.targetUserId);

  const [userSnap, targetSnap] = await Promise.all([getDoc(userRef), getDoc(targetRef)]);
  if (!userSnap.exists() || !targetSnap.exists()) {
    throw new Error("Both users must exist before connecting them.");
  }

  const updatePrimary: Record<string, unknown> = {
    connectedUserIds: arrayUnion(input.targetUserId),
    updatedAt: serverTimestamp(),
  };

  const updateTarget: Record<string, unknown> = {
    connectedUserIds: arrayUnion(input.userId),
    updatedAt: serverTimestamp(),
  };

  if (input.relationToTarget?.trim()) {
    updatePrimary[`relations.${input.targetUserId}`] = input.relationToTarget.trim();
  }

  if (input.relationToUser?.trim()) {
    updateTarget[`relations.${input.userId}`] = input.relationToUser.trim();
  }

  await Promise.all([updateDoc(userRef, updatePrimary), updateDoc(targetRef, updateTarget)]);

  const [nextUser, nextTarget] = await Promise.all([getDoc(userRef), getDoc(targetRef)]);
  return [
    mapUser(nextUser.id, nextUser.data() as Record<string, unknown>),
    mapUser(nextTarget.id, nextTarget.data() as Record<string, unknown>),
  ];
}

export async function ListUsers(): Promise<UserRecord[]> {
  const firestore = requireDb();
  const snapshots = await getDocs(collection(firestore, COLLECTIONS.USERS));

  return snapshots.docs.map((snapshot) =>
    mapUser(snapshot.id, snapshot.data() as Record<string, unknown>)
  );
}

export async function GetCurrentUser(): Promise<UserRecord | null> {
  const firebaseAuth = ensureAuth();
  const currentUser = firebaseAuth.currentUser;
  if (!currentUser) return null;

  return EnsureUser({
    externalId: currentUser.uid,
    email: currentUser.email ?? undefined,
    displayName: currentUser.displayName ?? undefined,
  });
}

export async function RelationFor(
  userId: string,
  targetUserId: string
): Promise<string | null> {
  const firestore = requireDb();
  const userSnap = await getDoc(doc(firestore, COLLECTIONS.USERS, userId));
  if (!userSnap.exists()) return null;

  const relations = userSnap.data().relations as Record<string, unknown> | undefined;
  const relation = relations?.[targetUserId];
  return typeof relation === "string" ? relation : null;
}
