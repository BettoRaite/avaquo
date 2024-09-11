import type { userPreferencesSchema } from "../schemas/schemas";
import type { authProviders } from "../db/firebase";

export type AuthProviders = keyof typeof authProviders;

export type AdviceItem = {
  id: number;
  content: string;
};

export type AppUser = {
  name: string;
  adviceIds: number[];
};

export type UserPreferences = ReturnType<typeof userPreferencesSchema.parse>;

export type FirebaseErrorObject = {
  message: string;
  code: string;
};
