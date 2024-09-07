import { FirebaseError } from "firebase/app";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { authSchema } from "../../schemas/schemas";

export async function handleEmailPasswordSignUp(
  params: ReturnType<typeof authSchema.parse>
) {
  try {
    const { email, password } = authSchema.parse(params);
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Failed to sign up user", error);
      return {
        message: error.message,
        code: error.code,
      };
    }
    throw error;
  }
}

export async function handleEmailPasswordSignIn(
  params: ReturnType<typeof authSchema.parse>
) {
  try {
    const { email, password } = authSchema.parse(params);
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Failed to sign in user", error);
      return {
        message: error.message,
        code: error.code,
      };
    }
    throw error;
  }
}

export async function handleSignOut() {
  try {
    await signOut(auth);
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Failed to sign out user", error);
      return {
        message: error.message,
        code: error.code,
      };
    }
    throw error;
  }
}

export async function sendVerification() {
  try {
    const { currentUser: user } = auth;
    if (!user) {
      throw new TypeError("User does not exist.");
    }
    await sendEmailVerification(user);
  } catch (error) {
    if (error instanceof FirebaseError) {
      console.error("Failed to send verification email.", error);
      return {
        message: error.message,
        code: error.code,
      };
    }
    throw error;
  }
}
