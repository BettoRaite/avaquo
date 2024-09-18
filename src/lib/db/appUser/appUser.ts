import type { AppUser } from "../../utils/definitions";
import { appUserSchema } from "../../schemas/schemas";
import { FirebaseError } from "firebase/app";
import { getDocs, setDoc, doc, where, query, getDoc } from "firebase/firestore";
import { AppError } from "../../utils/error";
import { getUserId } from "../utils";
import { errorLogger } from "@/lib/utils/errorLogger";
import { userNamesCollectionRef, usersCollectionRef } from "../firebase";

function generateNameWithNumberPostfix(): string {
  const id = new Date().getTime();
  return `name${id}`;
}

async function isNameTaken(name: string): Promise<boolean> {
  const nameQuery = query(userNamesCollectionRef, where("name", "==", name));
  const snapshot = await getDocs(nameQuery);
  return !snapshot.empty;
}

async function getUniqueUserName(): Promise<string> {
  const attempts = 50;
  let name = generateNameWithNumberPostfix();
  for (let i = 0; i < attempts; ++i) {
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
}
/**
 * Adds/updates user name in user names collection.
 * @param name App user name.
 */
async function updateUserName(name: string) {
  try {
    const uid = getUserId();
    await setDoc(doc(userNamesCollectionRef, uid), { name });
  } catch (error) {
    if (error instanceof FirebaseError) {
      error.customData = {
        name,
      };
    }
    throw error;
  }
}
/**
 * Initializes app user in firestore.
 * @returns AppUser or null if an error has occured.
 */
export async function initAppUser(): Promise<AppUser | null> {
  const uid = getUserId();

  const name = await getUniqueUserName();
  const appUser: AppUser = {
    name,
    adviceIds: [],
  };
  await updateUserName(name);
  await setDoc(doc(usersCollectionRef, uid), appUser);
  return appUser;
}
/**
 * Retrieves app user data from firestore.
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
      console.error("Failed to get app user\n", error);
      return null;
    }
    throw error;
  }
}
type ActionType = "remove_advice" | "add_advice" | "change_name";
export async function updateAppUser(nextAppUser: AppUser, action: ActionType) {
  try {
    const uid = getUserId();
    appUserSchema.parse(nextAppUser);

    if (action === "change_name") {
      const prevAppUser = await getAppUser();
      if (!prevAppUser) {
        throw new AppError(
          "App user does not exist, while trying to change name",
          false,
          {
            nextAppUser,
          }
        );
      }
      const { name } = nextAppUser;
      if (await isNameTaken(name)) {
        throw new AppError("name_is_taken", true);
      }
      await updateUserName(name);
    }

    await setDoc(doc(usersCollectionRef, uid), nextAppUser);
  } catch (error) {
    if (error instanceof FirebaseError) {
      errorLogger("Failed to set app user\n", error, {
        nextAppUser,
        action,
      });
      error.customData = {
        nextAppUser,
      };
    }
    throw error;
  }
}
