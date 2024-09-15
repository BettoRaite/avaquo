import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  connectFirestoreEmulator,
} from "firebase/firestore";
import {
  getAuth,
  connectAuthEmulator,
  GoogleAuthProvider,
} from "firebase/auth";

export * from "./adviceCollection/adviceCollection";
export * from "./appUser/appUser";
export * from "./auth/auth";
export * from "./utils/index";
export * from "./userAccount/userAccount";

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
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const authProviders = {
  google: new GoogleAuthProvider(),
};

export const usersCollectionRef = collection(firestore, "users");
export const adviceCollectionRef = collection(firestore, "public_advice");
export const privateAdviceCollectionRef = collection(
  firestore,
  "private_advice"
);
export const userNamesCollectionRef = collection(firestore, "user_names");

if (VITE_ENV !== "PROD") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(firestore, "localhost", 8080);
}
