import { FirebaseError } from "firebase/app";
import { ZodError } from "zod";
import {
  addDoc,
  getDocs,
  getDoc,
  setDoc,
  doc,
  where,
  query,
} from "firebase/firestore";
import {
  NonExistentUserError,
  UserNotAuthorizedError,
  type AuthorizationErrorDetails,
} from "../utils/errors";
import type { AdviceItem } from "../utils/types";
import type { AppUser } from "../utils/types";
import { auth, firestore, adviceCollectionRef } from "./firebase";
import { adviceSchema, appUserSchema } from "../schemas/schemas";

function getUserId(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new NonExistentUserError();
  }
  return uid;
}
/**
 * Check for both whether user has been authenticated and
 * whether authorized.
 */
function checkAuthStatus(details?: AuthorizationErrorDetails) {
  if (!auth.currentUser) {
    throw new NonExistentUserError();
  }
  if (!auth.currentUser.emailVerified) {
    throw new UserNotAuthorizedError(details);
  }
}
/**
 * Retrieves app user data from firestore.
 * @throws `NonExistentUserError` if user has no been authenticated.
 * @returns `null` if app user data has not yet been initialized or unexpected
 * FirebaseError has occured.
 */
export async function getAppUser(): Promise<AppUser | null> {
  try {
    const uid = getUserId();
    const snapshot = await getDoc(doc(firestore, "users", uid));
    return snapshot.exists() ? (snapshot.data() as AppUser) : null;
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Failed to read app user data.", error);
      return null;
    }
    throw error;
  }
}

export async function setAppUser(appUser: AppUser) {
  try {
    const uid = getUserId();
    await setDoc(doc(firestore, "users", uid), appUser);
    return appUser;
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Failed to set app user.", error);
      return;
    }
    throw error;
  }
}

export async function addToAdviceCollection(item: AdviceItem) {
  try {
    adviceSchema.parse(item);
    checkAuthStatus();

    const id = await getAdviceIdWithSameContent(item);
    if (id) {
      return id;
    }
    await addDoc(adviceCollectionRef, item);
    return item.id;
  } catch (error) {
    console.error("Failed to add item to advice collection", error);
    return null;
  }
}

export async function getAdviceIdWithSameContent(
  item: AdviceItem
): Promise<null | number> {
  const adviceQuery = query(
    adviceCollectionRef,
    where("text", "==", item.content)
  );
  const snapshot = await getDocs(adviceQuery);

  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    const { id } = doc.data();
    return id;
  }
  return null;
}

/**
 * Retrieves an advice collection from Firestore, based on
 * the `appUser` advice ids.
 * @param appUser The app user.
 * @returns The advice collection or null if an error occurs.
 */
export async function getAdviceCollection(
  appUser: AppUser
): Promise<AdviceItem[] | null> {
  try {
    appUserSchema.parse(appUser);
    if (appUser.adviceIds.length === 0) {
      return [];
    }
    const adviceQuery = query(
      adviceCollectionRef,
      where("id", "in", appUser.adviceIds)
    );
    const snapshot = await getDocs(adviceQuery);
    const adviceCollection: AdviceItem[] = [];
    for (const doc of snapshot.docs) {
      adviceCollection.push(doc.data() as AdviceItem);
    }

    return adviceCollection;
  } catch (error) {
    if (error instanceof ZodError) {
      console.error("Invalid app user data:", error.errors);
      return null;
    }

    if (error instanceof FirebaseError) {
      console.error("Firestore error:", error.message, error.code);
      return null;
    }
    console.error(
      "Unexpected error while retrieving advice collection:",
      error
    );
    return null;
  }
}
