import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { AppUser, AdviceItem } from "../../lib/utils/types";

type AppUserContextModel = {
  appUser: AppUser | null;
  initAppUser: (user: AppUser) => void;
  saveAdvice: (item: AdviceItem) => Promise<void>;
};

export const AppUserContext = createContext<AppUserContextModel>(
  {} as AppUserContextModel
);
export const useAppUserContext = () => {
  return useContext(AppUserContext);
};
