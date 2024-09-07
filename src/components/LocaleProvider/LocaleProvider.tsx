import { type ReactNode, useState } from "react";
import type { SupportedLocales } from "../../lib/schemas/schemas";
import { LocaleContext } from "./localeContext";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import {
  loadUserPreferences,
  saveUserPreferences,
} from "../../lib/localStorage";

type LocaleProviderProps = {
  children: ReactNode;
};

export function LocaleProvider({ children }: LocaleProviderProps) {
  const [language, setLanguage] = useState<SupportedLocales>(() => {
    const userPreferences = loadUserPreferences();
    if (userPreferences?.lang) {
      return userPreferences.lang;
    }
    return "en";
  });
  const { i18n } = useTranslation();

  useEffect(() => {
    saveUserPreferences({
      lang: language,
    });
    i18n.changeLanguage(language);
  }, [language, i18n]);

  const value = {
    language,
    setLanguage,
  };
  return (
    <LocaleContext.Provider value={value}>{children} </LocaleContext.Provider>
  );
}
