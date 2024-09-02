import { type ReactNode, useEffect, useState } from "react";
import { auth } from "../../lib/db/firebase";
import {
  type UserCredential,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
  type User,
} from "firebase/auth";
import { AuthContext } from "./authContext";

function signUp(email: string, password: string): Promise<UserCredential> {
  return createUserWithEmailAndPassword(auth, email, password);
}

function signIn(email: string, password: string): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}
function logOut() {
  return signOut(auth);
}
function resetPassword(email: string): Promise<void> {
  return sendPasswordResetEmail(auth, email);
}
async function verify() {
  const user = auth.currentUser;
  if (user) {
    await sendEmailVerification(user);
    return user;
  }
  return null;
}
export interface AuthProviderProps {
  children?: ReactNode;
}
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);
  const values = {
    auth,
    user,
    isEmailVerified: Boolean(user?.emailVerified),
    signUp,
    signIn,
    logOut,
    verify,
    resetPassword,
  };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
