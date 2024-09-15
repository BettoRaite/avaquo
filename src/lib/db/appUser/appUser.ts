import type { AppUser } from "../../utils/types";
import { appUserSchema } from "../../schemas/schemas";
import { FirebaseError } from "firebase/app";
import { getDocs, setDoc, doc, where, query, getDoc } from "firebase/firestore";
import { AppError } from "../../utils/errors";
import { getUserId } from "../utils";
import { errorLogger } from "@/lib/utils/errorLogger";
import { userNamesCollectionRef, usersCollectionRef } from "../firebase";

function generateNameWithNumberPostfix(): string {
  const id = new Date().getTime();
  return `name${id}`;
}

async function isNameTaken(name: string): Promise<boolean | null> {
  try {
    const nameQuery = query(userNamesCollectionRef, where("name", "==", name));
    const snapshot = await getDocs(nameQuery);
    return !snapshot.empty;
  } catch (error) {
    if (error instanceof FirebaseError) {
      errorLogger("Failed to check if name is taken", error, {
        name,
      });
      return null;
    }
    throw error;
  }
}

async function getUniqueUserName(): Promise<string | null> {
  const attemps = 10;
  try {
    let name = generateNameWithNumberPostfix();
    for (let i = 0; i < attemps; ++i) {
      const isTaken = await isNameTaken(name);
      if (isTaken === null) {
        return null;
      }
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
    if (error instanceof FirebaseError) {
      console.error("Failed to generate user name\n", error);
      return null;
    }
    throw error;
  }
}
/**
 * Adds/updates user name in user names collection.
 * @param name App user name.
 * @returns Null if an error has occured.
 */
async function setUserName(name: string) {
  try {
    const uid = getUserId();
    await setDoc(doc(userNamesCollectionRef, uid), { name });
  } catch (error) {
    if (error instanceof FirebaseError) {
      errorLogger("Failed to set user name", error, { name });
      return null;
    }
    throw error;
  }
}
/**
 * Initializes app user in firestore.
 * @returns AppUser or null if an error has occured.
 */
export async function initAppUser(): Promise<AppUser | null> {
  try {
    const uid = getUserId();

    const name = await getUniqueUserName();
    if (!name) {
      return null;
    }
    const appUser: AppUser = {
      name,
      adviceIds: [],
    };
    // [-]: Need better way of doing error handling.
    const result = await setUserName(name);
    if (result === null) {
      return null;
    }
    await setDoc(doc(usersCollectionRef, uid), appUser);
    return appUser;
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Failed to init app user\n", error);
      return null;
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
    const snapshot = await getDoc(doc(usersCollectionRef, uid));
    return snapshot.exists() ? (snapshot.data() as AppUser) : null;
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Failed to read app user data\n", error);
      return null;
    }
    throw error;
  }
}
type ActionType = "remove_advice" | "add_advice" | "change_name";
export async function setAppUser(appUser: AppUser, action: ActionType) {
  try {
    const uid = getUserId();
    appUserSchema.parse(appUser);

    if (action === "change_name") {
      const prevAppUser = await getAppUser();
      if (!prevAppUser) {
        throw new AppError("No app user", false);
      }
      const { name } = appUser;
      if (await isNameTaken(name)) {
        throw new AppError("Name is taken", true);
      }
      await setUserName(name);
    }

    await setDoc(doc(usersCollectionRef, uid), appUser);
  } catch (error) {
    if (error instanceof FirebaseError) {
      errorLogger("Failed to set app user\n", error, {
        appUser,
        action,
      });
    }
    throw error;
  }
}
