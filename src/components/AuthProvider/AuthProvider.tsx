import { type ReactNode, useEffect, useState } from "react";
import { auth } from "../../lib/db/firebase";
import { onAuthStateChanged, type User } from "firebase/auth";
import { AuthContext } from "./authContext";

export interface AuthProviderProps {
  children?: ReactNode;
}
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [IsEmailVerified, setIsEmailVerified] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsEmailVerified(user?.emailVerified ?? false);
    });
    return unsubscribe;
  }, []);

  const values = {
    user,
    setUser,
    isEmailVerified: IsEmailVerified,
    setIsEmailVerified,
  };
  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}
