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
import { FirebaseError } from "firebase/app";

type AppUserContextModel = {
  appUser: AppUser | null;
  setAppUser: Dispatch<SetStateAction<AppUser | null>>;
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
  const handleError = (error: Error) => {
    if (error instanceof AppError && error.isOperational) {
      setToastNotification(error.message);
    }
    if (error instanceof FirebaseError) {
      setToastNotification(
        FIREBASE_ERROR_MESSAGES[error.code] ??
          ERROR_MESSAGES.common.unexpectedError
      );
    }
    console.error("Failed to change user name\n", error);
    // setToastNotification(ERROR_MESSAGES.common.unexpectedError);
  };
  return {
    async changeName(name: string) {
      try {
        const { appUser } = checkIfUserVerified();
        const nextAppUser = {
          ...appUser,
          name,
        };
        await db.setAppUser(nextAppUser, "change_name");
        setAppUser(nextAppUser);
      } catch (error) {
        handleError(error as Error);
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
        // Checking for an impossible error.
        if (nextAppUser.adviceIds.includes(id)) {
          throw new AppError("Duplicate advice id", false);
        }
        nextAppUser.adviceIds.push(id);

        await db.setAppUser(nextAppUser, "add_advice");
        setAppUser(nextAppUser);
      } catch (error) {
        handleError(error as Error);
      }
    },
    async removeAdvice(item: AdviceItem) {
      try {
        const { appUser } = checkIfUserVerified();
        const docId = await db.getAdviceIdWithSameContent(item);
        // This is an impossible state, since user must have ref to the previously created document.
        if (!docId) {
          throw new AppError(
            `Advice item does not exist in firestore.\nAdvice:${JSON.stringify(
              item,
              null,
              4
            )}\n`,
            false
          );
        }

        if (!appUser.adviceIds.includes(docId)) {
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
          adviceIds: appUser.adviceIds.filter((id) => id !== docId),
        };

        await db.setAppUser(nextAppUser, "remove_advice");

        setAppUser(nextAppUser);
      } catch (error) {
        handleError(error as Error);
      }
    },
  };
};
