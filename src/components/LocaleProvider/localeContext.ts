import {
  useContext,
  createContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { SupportedLocales } from "../../lib/schemas/schemas";
// import type { useTranslation } from "react-i18next";

export function useLocaleContext() {
  return useContext(LocaleContext);
}
type LocaleContextModel = {
  language: SupportedLocales;
  setLanguage: Dispatch<SetStateAction<SupportedLocales>>;
  // handleApplyLanguage: (i18n: ReturnType<typeof useTranslation>["1"]) => void;
};
export const LocaleContext = createContext<LocaleContextModel>({
  language: "en",
} as LocaleContextModel);
