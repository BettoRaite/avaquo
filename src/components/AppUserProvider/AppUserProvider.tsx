import { type ReactNode, useState, useEffect } from "react";
import { AppUserContext } from "./appUserContext";
import type { AppUser } from "../../lib/utils/types";
import { useAuth } from "../AuthProvider/authContext";
import * as db from "../../lib/db/firebase";

type AppUserProviderProps = {
  children: ReactNode;
};

export function AppUserProvider({ children }: AppUserProviderProps) {
  const { user, isEmailVerified } = useAuth();
  const [appUser, setAppUser] = useState<null | AppUser>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function getAppUser() {
      let nextAppUser = null;
      if (user && isEmailVerified) {
        try {
          nextAppUser = await db.getAppUser();
          if (!nextAppUser) {
            nextAppUser = await db.createAppUser();
          }
        } catch (error) {
          console.error("Failed to retrieve app user data", error);
          setErrorMessage("Ops...an unexpected error has occured.");
        }
      }

      setAppUser(nextAppUser);
    }
    getAppUser();
  }, [user, isEmailVerified]);

  const value = {
    appUser,
    setAppUser,
    errorMessage,
  };

  return (
    <AppUserContext.Provider value={value}>{children}</AppUserContext.Provider>
  );
}
