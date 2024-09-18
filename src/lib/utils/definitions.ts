import type { userPreferencesSchema } from "../schemas/schemas";
import type { authProviders } from "../db/firebase";

export type ToastNotificationType =
  | "error"
  | "warn"
  | "message"
  | "success"
  | "info"
  | "loading";

export type ToastNotification = {
  message: string;
  type: ToastNotificationType;
};
export type AuthProviders = keyof typeof authProviders;

export type AdviceItem = {
  id?: number;
  content: string;
};

export type AppUser = {
  name: string;
  adviceIds: string[];
};

export type UserPreferences = ReturnType<typeof userPreferencesSchema.parse>;

export type FirebaseErrorObject = {
  message: string;
  code: string;
};
