import { ERROR_MESSAGES } from "./utils/constants";
import type { UserPreferences } from "./utils/types";

const PREFERENCES_KEY = "APP_USER_PREFERENCES";

export const saveUserPreferences = (preferences: UserPreferences) => {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.error(
      ERROR_MESSAGES.common.unexpectedError,
      `Preferences:${preferences}\n${error}`
    );
  }
};
export const loadUserPreferences = (): null | UserPreferences => {
  try {
    const json = localStorage.getItem(PREFERENCES_KEY);
    if (json) {
      return JSON.parse(json);
    }
    return null;
  } catch (error) {
    console.error(ERROR_MESSAGES.common.unexpectedError, error);
    return null;
  }
};
