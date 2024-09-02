import type { AppUser } from "./utils/types";
import { z } from "zod";

export interface AppUserAction extends Partial<AppUser> {
  type: "init" | "save_advice";
}

const AppUserSchema = z.object({
  name: z.string(),
  adviceIds: z.array(z.number()),
});

export function appUserReducer(appUser: AppUser, action: AppUserAction) {
  let nextAppUser: AppUser;

  try {
    switch (action.type) {
      case "init": {
        // [-]: Retrieve all app user fields.
        const { adviceIds, name } = action;

        nextAppUser = {
          adviceIds,
          name,
        } as AppUser;
        return nextAppUser;
      }
      case "save_advice": {
        if (!appUser) {
          throw new TypeError(
            "Trying to save advice, while app user does not exist."
          );
        }
        // [+]: appUser must exist.
        // [-]: Advice data is required.
        // [-]: Add advice to db.
        // [-]: Update user.
        // [-]: set updated user to db.

        return appUser;
      }
      default: {
        console.error("Unknown action type:", action);
      }
    }
  } catch (error) {
    // [-] Handle errors.
    console.error(error);
  } finally {
    // [-]: Save to local storage.
    console.log("Saving to local storage.");
  }
}
