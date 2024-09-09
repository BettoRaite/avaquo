import type { AppUser } from "../../utils/types";
import { appUserSchema } from "../../schemas/schemas";
import { FirebaseError } from "firebase/app";
import { getDocs, setDoc, doc, where, query, getDoc } from "firebase/firestore";
import { AppError } from "../../utils/errors";
import { firestore, usersCollectionRef } from "../firebase";
import { getUserId } from "../utils";

export async function createAppUser(): Promise<AppUser> {
  try {
    const uid = getUserId();

    const name = await getUniqueUserName();

    const appUser: AppUser = {
      name,
      adviceIds: [],
    };

    await setDoc(doc(firestore, "users", uid), appUser);
    return appUser;
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Failed to create app user.\n", error);
    }
    throw error;
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
    appUserSchema.parse(appUser);
    await setDoc(doc(firestore, "users", uid), appUser);
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Failed to set app user.\n", error);
      return {
        message: error.message,
        code: error.code,
      };
    }
    throw error;
  }
}

function generateNameWithNumberPostfix(): string {
  const id = new Date().getTime();
  return `name${id}`;
}

async function isNameTaken(name: string): Promise<boolean> {
  try {
    const nameQuery = query(usersCollectionRef, where("name", "==", name));
    const snapshot = await getDocs(nameQuery);
    return !snapshot.empty;
  } catch (error) {
    console.error("Failed to check if name is taken", error);
    throw error;
  }
}

async function getUniqueUserName(): Promise<string> {
  const attemps = 10;
  try {
    let name = generateNameWithNumberPostfix();
    for (let i = 0; i < attemps; ++i) {
      const isTaken = await isNameTaken(name);
      if (isTaken) {
        name = generateNameWithNumberPostfix();
        continue;
      }
      return name;
    }
    throw new AppError(
      "Failed to generate a random user name, exhausted number of attempts",
      false
    );
  } catch (error) {
    console.error("Failed to generate user name", error);
    throw error;
  }
}
