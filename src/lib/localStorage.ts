import type { AppUser } from "./utils/types";

export const AppUserKey = "AppUserKey";

function saveAppUser(appUser: AppUser) {
  try {
    localStorage.setItem(AppUserKey, JSON.stringify(appUser));
    return appUser;
  } catch (error) {
    console.error("Failed to save app user to local storage", error);
    return null;
  }
}
function loadAppUser() {
  const json = localStorage.getItem(AppUserKey);
  if (!json) {
    return null;
  }
  try {
    return JSON.parse(json);
  } catch (error) {
    console.error("Error parsing app user data:", error);
    return null;
  }
}
export const storage = {
  loadAppUser,
  saveAppUser,
};
