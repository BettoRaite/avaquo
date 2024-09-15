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

  useEffect(() => {
    async function retrieveAppUser() {
      let nextAppUser = null;
      if (user && isEmailVerified) {
        try {
          nextAppUser = await db.getAppUser();
          // Initializing app user in firestore.
          if (!nextAppUser) {
            nextAppUser = await db.initAppUser();
            // An error has occured.
            if (!nextAppUser) {
              return;
            }
          }
        } catch (error) {
          console.error(
            "Unexpected error during app user data retrieval\n",
            error
          );
          return;
        }
      }

      setAppUser(nextAppUser);
    }
    retrieveAppUser();
  }, [user, isEmailVerified]);

  const value = {
    appUser,
    setAppUser,
  };

  return (
    <AppUserContext.Provider value={value}>{children}</AppUserContext.Provider>
  );
}
