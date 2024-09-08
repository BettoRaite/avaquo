import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  connectFirestoreEmulator,
} from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
export * from "./adviceCollection/adviceCollection";
export * from "./appUser/appUser";
export * from "./auth/auth";
export * from "./utils/index";
export * from "./userAccount/userAccount";

const ENV = import.meta.env.VITE_ENV;

const loadEnv = () => {
  const envVariables = {
    API_KEY: import.meta.env.VITE_API_KEY,
    AUTH_DOMAIN: import.meta.env.VITE_AUTH_DOMAIN,
    PROJECT_ID: import.meta.env.VITE_PROJECT_ID,
    STORAGE_BUCKET: import.meta.env.VITE_STORAGE_BUCKET,
    MESSAGING_SENDER_ID: import.meta.env.VITE_MESSAGING_SENDER_ID,
    APP_ID: import.meta.env.VITE_APP_ID,
    MEASUREMENT_ID: import.meta.env.VITE_MEASUREMENT_ID,
  } as Record<string, string>;

  if (ENV === "PROD") {
    Object.keys(envVariables).forEach((key) => {
      envVariables[key] = import.meta.env[key];
    });
  }

  return Object.freeze(envVariables);
};

const {
  API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  APP_ID,
  MEASUREMENT_ID,
} = loadEnv();

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
export const usersCollectionRef = collection(firestore, "users");
const ADVICE_COLLECTION_NAME = "public_advice";
export const adviceCollectionRef = collection(
  firestore,
  ADVICE_COLLECTION_NAME
);
export const privateAdviceCollectionRef = collection(
  firestore,
  "private_advice"
);

if (ENV !== "PROD") {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(firestore, "localhost", 8080);
}
