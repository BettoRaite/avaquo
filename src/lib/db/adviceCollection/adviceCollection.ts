import { FirebaseError } from "firebase/app";
import { ZodError } from "zod";
import {
  addDoc,
  getDocs,
  where,
  query,
  documentId,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import type { AdviceItem, AppUser } from "../../utils/definitions";
import { adviceCollectionRef } from "../firebase";
import { adviceSchema, appUserSchema } from "../../schemas/schemas";
import { getAdviceIdWithSameContent } from "../utils";
import { errorLogger } from "@/lib/utils/errorLogger";
import { AppError } from "@/lib/utils/error";
import { splitInto2DArray } from "@/lib/utils/array";

/**
 * Adds advice item to advice collection, if no advice
 * with same text content exists in firestore, after that it returns
 * the id of newly created document. In case, there is already
 * advice in advice collection with same content, it returns the doc id.
 * @param item Advice item.
 * @returns If no error occurs id of a newly created doc, or id of an existant doc. In case of
 * error null is returned.
 */
export async function addToAdviceCollection(item: AdviceItem) {
  try {
    adviceSchema.parse(item);
    const id = await getAdviceIdWithSameContent(item);
    if (id) return id;
    const doc = await addDoc(adviceCollectionRef, item);
    return doc.id;
  } catch (error) {
    if (error instanceof FirebaseError) {
      error.customData = {
        item,
      };
    }
    throw error;
  }
}

/**
 * Retrieves docs from advice collection, ids of which match
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
    const adviceIds2D = splitInto2DArray(appUser.adviceIds, 30);
    const docs2D: QueryDocumentSnapshot[][] = [];
    for (const adviceIds of adviceIds2D) {
      const adviceQuery = query(
        adviceCollectionRef,
        where(documentId(), "in", adviceIds)
      );
      const snapshot = await getDocs(adviceQuery);
      docs2D.push(snapshot.docs);
    }

    const adviceCollection: AdviceItem[] = [];

    for (const docs of docs2D) {
      for (const doc of docs) {
        adviceCollection.push(doc.data() as AdviceItem);
      }
    }

    if (adviceCollection.length === 0) {
      throw new AppError(
        "Advice collection is empty, even though user has references to advice documents",
        false,
        {
          docs2D: docs2D,
        }
      );
    }
    return adviceCollection;
  } catch (error) {
    if (error instanceof ZodError) {
      errorLogger("Invalid app user data", error, {
        appUser,
      });
      return null;
    }
    if (error instanceof FirebaseError) {
      errorLogger("Failed to retrieve advice collection", error, {
        appUser,
      });
      return null;
    }
    throw error;
  }
}
