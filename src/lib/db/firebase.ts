import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  connectFirestoreEmulator,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  connectAuthEmulator,
} from "firebase/auth";
import { NonExistentUserError } from "../utils/errors";
import type { AdviceItem } from "../utils/types";

const {
  VITE_API_KEY,
  VITE_AUTH_DOMAIN,
  VITE_PROJECT_ID,
  VITE_STORAGE_BUCKET,
  VITE_MESSAGING_SENDER_ID,
  VITE_APP_ID,
  VITE_MEASUREMENT_ID,
  VITE_ENV,
} = import.meta.env;

const firebaseConfig = {
  apiKey: VITE_API_KEY,
  authDomain: VITE_AUTH_DOMAIN,
  projectId: VITE_PROJECT_ID,
  storageBucket: VITE_STORAGE_BUCKET,
  messagingSenderId: VITE_MESSAGING_SENDER_ID,
  appId: VITE_APP_ID,
  measurementId: VITE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const usersCollection = collection(db, "users");
export const adviceCollection = collection(db, "public_advice");

export async function addCurrentUser(name: string) {
  try {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      throw new NonExistentUserError();
    }
    await setDoc(doc(db, "users", uid), {
      name,
    });
  } catch (error) {
    console.error("Failed to add user to firestore", error);
  }
}

// async function getAdviceCollection(): AdviceItem[] | null {
//   try {
//     const uid = auth.currentUser?.uid;
//     if (!uid) {
//       throw new NonExistentUserError();
//     }
//     const snapshot =

//   } catch (error) {
//     console.error("Failed to read advice collection", error);
//     return null;
//   }
// }

if (VITE_ENV !== "PROD") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, "localhost", 8080);
}
