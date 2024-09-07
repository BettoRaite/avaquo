import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { User } from "firebase/auth";

export interface AuthContextModel {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  isEmailVerified: boolean;
  setIsEmailVerified: Dispatch<SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextModel>(
  {} as AuthContextModel
);

export const useAuth = (): AuthContextModel => {
  return useContext(AuthContext);
};
