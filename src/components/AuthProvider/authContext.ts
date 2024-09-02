import { createContext, useContext } from "react";
import type { Auth, User, UserCredential } from "firebase/auth";
export interface AuthContextModel {
  auth: Auth;
  user: User | null;
  isEmailVerified: boolean;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signUp: (email: string, password: string) => Promise<UserCredential>;
  logOut: () => Promise<void>;
  verify: () => Promise<null | User>;
  sendPasswordResetEmail?: (email: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextModel>(
  {} as AuthContextModel
);

export const useAuth = (): AuthContextModel => {
  return useContext(AuthContext);
};
