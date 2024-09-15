import { auth } from "../firebase";
import { AppError } from "../../utils/errors";
import type { AdviceItem } from "../../utils/types";
import { where, query, getDocs } from "firebase/firestore";
import { adviceCollectionRef } from "../firebase";

export function getUserId(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new AppError("User does not exist", false);
  }
  return uid;
}

/**
 * Check for both whether user has been authenticated and
 * whether authorized.
 */
export function checkAuthStatus() {
  if (!auth.currentUser) {
    throw new AppError("User does not exist", true);
  }
  if (!auth.currentUser.emailVerified) {
    throw new AppError("User is not verified", true);
  }
}

export async function getAdviceIdWithSameContent(
  item: AdviceItem
): Promise<null | string> {
  const adviceQuery = query(
    adviceCollectionRef,
    where("content", "==", item.content)
  );
  const snapshot = await getDocs(adviceQuery);

  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    return doc.id;
  }
  return null;
}
