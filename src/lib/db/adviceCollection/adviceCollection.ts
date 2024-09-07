import { FirebaseError } from "firebase/app";
import { ZodError } from "zod";
import { addDoc, getDocs, where, query } from "firebase/firestore";
import type { AdviceItem, AppUser } from "../../utils/types";
import { adviceCollectionRef } from "../firebase";
import { adviceSchema, appUserSchema } from "../../schemas/schemas";
import { checkAuthStatus } from "../utils";
import { getAdviceIdWithSameContent } from "../utils";

/**
 * Adds advice to advice collection, if no advice
 * with same text content exists, then returns its id,
 * otherwise the id of an existant advice.
 * @param item Advice item.
 * @returns Advice item id, or null if an error has occured, or
 */
export async function addToAdviceCollection(
  item: AdviceItem
): Promise<null | number> {
  try {
    adviceSchema.parse(item);
    const id = await getAdviceIdWithSameContent(item);
    if (id) {
      return id;
    }
    await addDoc(adviceCollectionRef, item);
    return item.id;
  } catch (error) {
    console.error("Failed to add advice to advice collection\n", error);
    return null;
  }
}

export async function removeFromAdviceCollection(item: AdviceItem) {
  try {
    adviceSchema.parse(item);
    checkAuthStatus();

    const id = await getAdviceIdWithSameContent(item);
    if (!id) {
      return;
    }
  } catch (error) {
    console.error("Failed to remove from advice collection", error);
    // [-]: Add appropriate error-handling.
    throw error;
  }
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
