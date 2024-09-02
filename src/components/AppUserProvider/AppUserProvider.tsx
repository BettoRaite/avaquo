import { type ReactNode, useState, useEffect } from "react";
import { AppUserContext } from "./appUserContext";
import type { AppUser } from "../../lib/utils/types";
import { useAuth } from "../AuthProvider/authContext";
import * as db from "../../lib/db";
import { storage } from "../../lib/localStorage";
import { useCallback } from "react";
import type { AdviceItem } from "../../lib/utils/types";

type AppUserProviderProps = {
  children: ReactNode;
};
export function AppUserProvider({ children }: AppUserProviderProps) {
  const { isEmailVerified } = useAuth();
  const [appUser, setAppUser] = useState<null | AppUser>(null);

  const initAppUser = useCallback((user: AppUser) => {
    setAppUser(user);
    storage.saveAppUser(user);
  }, []);

  const saveAdvice = async (item: AdviceItem) => {
    if (isEmailVerified && appUser) {
      const nextAppUser = {
        ...appUser,
        adviceIds: [...appUser.adviceIds],
      };
      const id = await db.addToAdviceCollection(item);
      if (!id) {
        throw new TypeError(
          `Expected advice id to be number instead received: ${id}`
        );
      }
      nextAppUser.adviceIds.push(id);
      await db.setAppUser(nextAppUser);
      setAppUser(nextAppUser);
    }
  };

  useEffect(() => {
    async function loadAppUser() {
      let nextAppUser = null;

      if (isEmailVerified) {
        nextAppUser = await db.getAppUser();
      }

      if (isEmailVerified && !nextAppUser) {
        nextAppUser = storage.loadAppUser();
      }

      setAppUser(nextAppUser);
    }
    loadAppUser();
  }, [isEmailVerified]);

  useEffect(() => {
    async function setupAppUser() {
      if (isEmailVerified) {
        const storedAppUser = await db.getAppUser();
        if (!storedAppUser && appUser && isEmailVerified) {
          db.setAppUser(appUser);
        }
      }
    }
    setupAppUser();
  }, [appUser, isEmailVerified]);

  const value = {
    appUser,
    initAppUser,
    saveAdvice,
  };

  return (
    <AppUserContext.Provider value={value}>{children}</AppUserContext.Provider>
  );
}
