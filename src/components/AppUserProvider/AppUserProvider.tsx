import { type ReactNode, useState, useEffect } from "react";
import { AppUserContext } from "./appUserContext";
import type { AppUser } from "../../lib/utils/definitions";
import { useAuth } from "../AuthProvider/authContext";
import * as db from "../../lib/db/firebase";
import { useErrorHandler } from "@/hooks/useErrorHandler";

type AppUserProviderProps = {
  children: ReactNode;
};

export function AppUserProvider({ children }: AppUserProviderProps) {
  const { user, isEmailVerified } = useAuth();
  const [appUser, setAppUser] = useState<null | AppUser>(null);
  const [isLoading, setIsLoading] = useState(true);
  const errorHandler = useErrorHandler();
  useEffect(() => {
    async function retrieveAppUser() {
      let appUser = null;

      try {
        // checking if user is logged
        const loggedAndVerified = user && isEmailVerified;
        if (!loggedAndVerified) {
          return;
        }
        appUser = await db.getAppUser();
        if (!appUser) {
          appUser = await db.initAppUser();
          // An error has occured.
          if (!appUser) return;
        }
      } catch (error) {
        errorHandler(error as Error, "retrieveAppUser");
        return;
      } finally {
        setIsLoading(false);
        setAppUser(appUser);
      }
      setAppUser(appUser);
    }
    retrieveAppUser();
  }, [user, isEmailVerified, errorHandler]);

  const value = {
    appUser,
    setAppUser,
    isLoading,
  };

  return (
    <AppUserContext.Provider value={value}>{children}</AppUserContext.Provider>
  );
}
