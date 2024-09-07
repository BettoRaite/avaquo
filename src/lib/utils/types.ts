import type { userPreferencesSchema } from "../schemas/schemas";

export type AdviceItem = {
  id: number;
  content: string;
};

export type AppUser = {
  name: string;
  adviceIds: number[];
};

export type UserPreferences = ReturnType<typeof userPreferencesSchema.parse>;
