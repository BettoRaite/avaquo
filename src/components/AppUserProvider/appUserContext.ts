import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import * as db from "../../lib/db/firebase";
import type { AppUser, AdviceItem } from "../../lib/utils/definitions";
import { useAuth } from "../AuthProvider/authContext";
import { AppError } from "../../lib/utils/error";
import { useErrorHandler } from "@/hooks/useErrorHandler";

type AppUserContextModel = {
  appUser: AppUser | null;
  setAppUser: Dispatch<SetStateAction<AppUser | null>>;
  isLoading: boolean;
};

export const AppUserContext = createContext<AppUserContextModel>(
  {} as AppUserContextModel
);
export const useAppUserContext = () => {
  return useContext(AppUserContext);
};
export const useAppUserHandler = () => {
  const { appUser, setAppUser } = useContext(AppUserContext);
  const { isEmailVerified } = useAuth();
  const errorHandler = useErrorHandler();
  const checkIfUserVerified = () => {
    if (isEmailVerified && appUser) {
      return {
        appUser,
      };
    }
    throw new AppError("User not authorized to perform this action", false);
  };

  return {
    async changeName(name: string) {
      try {
        const { appUser } = checkIfUserVerified();
        const nextAppUser = {
          ...appUser,
          name,
        };
        await db.updateAppUser(nextAppUser, "change_name");
        setAppUser(nextAppUser);
      } catch (error) {
        errorHandler(error as Error, this.changeName.name);
      }
    },
    async saveAdvice(item: AdviceItem) {
      try {
        const { appUser } = checkIfUserVerified();
        const nextAppUser = {
          ...appUser,
          adviceIds: [...appUser.adviceIds],
        };
        const id = await db.addToAdviceCollection(item);
        // Checking for an impossible error.
        if (nextAppUser.adviceIds.includes(id)) {
          throw new AppError("Duplicate advice id", false);
        }
        nextAppUser.adviceIds.push(id);

        await db.updateAppUser(nextAppUser, "add_advice");
        setAppUser(nextAppUser);
      } catch (error) {
        errorHandler(error as Error, this.saveAdvice.name);
      }
    },
    async removeAdvice(item: AdviceItem) {
      try {
        const { appUser } = checkIfUserVerified();
        const docId = await db.getAdviceIdWithSameContent(item);
        // This is an impossible state, since user must have ref to the previously created document.
        if (!docId) {
          throw new AppError(
            "App user has reference to advice doc which does not exist",
            false,
            {
              appUser,
              item,
            }
          );
        }

        if (!appUser.adviceIds.includes(docId)) {
          throw new AppError("App user does not have advice doc id", false, {
            appUser,
            item,
          });
        }

        const nextAppUser = {
          ...appUser,
          adviceIds: appUser.adviceIds.filter((id) => id !== docId),
        };

        await db.updateAppUser(nextAppUser, "remove_advice");
        setAppUser(nextAppUser);
      } catch (error) {
        errorHandler(error as Error, this.removeAdvice.name);
      }
    },
  };
};
