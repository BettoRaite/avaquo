import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import * as db from "../../lib/db/firebase";
import type { AppUser, AdviceItem } from "../../lib/utils/types";
import { useAuth } from "../AuthProvider/authContext";
import { AppError } from "../../lib/utils/errors";
import { useToastNotificationContext } from "../ToastNotificationProvider/toastNotificationContext";
import {
  ERROR_MESSAGES,
  FIREBASE_ERROR_MESSAGES,
} from "../../lib/utils/constants";

type AppUserContextModel = {
  appUser: AppUser | null;
  setAppUser: Dispatch<SetStateAction<AppUser | null>>;
  errorMessage: string;
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
  const { setToastNotification } = useToastNotificationContext();
  const checkIfUserVerified = () => {
    if (isEmailVerified && appUser) {
      return {
        appUser,
      };
    }
    throw new AppError("User not authorized to perform this action", false);
  };
  /*
// FIXME: Replace user adviceIds with string ids of advice docs. 
Currently the way how relations between advice and user are handled is 
with the actual id of advice, but what if we have advice docs
with same id, but different translations? 

*/
  return {
    async changeName(name: string) {
      try {
        const { appUser } = checkIfUserVerified();
        const nextAppUser = {
          ...appUser,
          name,
        };

        const errorObject = await db.setAppUser(nextAppUser);
        if (errorObject) {
          setToastNotification(
            FIREBASE_ERROR_MESSAGES[errorObject.code] ??
              ERROR_MESSAGES.common.unexpectedError
          );
          return;
        }

        setAppUser(nextAppUser);
      } catch (error) {
        console.error("Failed to change user name", error);
        setToastNotification(ERROR_MESSAGES.common.unexpectedError);
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
        if (!id) {
          setToastNotification(ERROR_MESSAGES.common.unexpectedError);
          return;
        }
        if (nextAppUser.adviceIds.includes(id)) {
          throw new AppError("Duplicate advice id", false);
        }
        nextAppUser.adviceIds.push(id);

        const errorObject = await db.setAppUser(nextAppUser);
        if (errorObject) {
          setToastNotification(
            FIREBASE_ERROR_MESSAGES[errorObject.code] ??
              ERROR_MESSAGES.common.unexpectedError
          );
          return;
        }

        setAppUser(nextAppUser);
      } catch (error) {
        console.error(ERROR_MESSAGES.common.unexpectedError, error);
        setToastNotification(ERROR_MESSAGES.common.unexpectedError);
      }
    },
    async removeAdvice(item: AdviceItem) {
      try {
        const { appUser } = checkIfUserVerified();
        const id = await db.getAdviceIdWithSameContent(item);
        if (!id) {
          throw new AppError(
            `The advice does not exist in firestore.\nAdvice:${JSON.stringify(
              item,
              null,
              4
            )}\n`,
            false
          );
        }
        if (!appUser.adviceIds.includes(id)) {
          throw new AppError(
            `App user does not have the advice id.\nAdvice:${JSON.stringify(
              item,
              null,
              4
            )}\nApp user::${JSON.stringify(appUser, null, 4)}`,
            false
          );
        }
        const nextAppUser = {
          ...appUser,
          adviceIds: appUser.adviceIds.filter((id) => id !== item.id),
        };

        const errorObject = await db.setAppUser(nextAppUser);
        if (errorObject) {
          setToastNotification(
            FIREBASE_ERROR_MESSAGES[errorObject.code] ??
              ERROR_MESSAGES.common.unexpectedError
          );
          return;
        }

        setAppUser(nextAppUser);
      } catch (error) {
        console.error(ERROR_MESSAGES.common.unexpectedError, error);
        setToastNotification(ERROR_MESSAGES.common.unexpectedError);
      }
    },
  };
};
