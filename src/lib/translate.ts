import axios from "axios";
import type { SupportedLocales } from "./schemas/schemas";
const { VITE_APP_DOMAIN } = import.meta.env;

const URL = "https://microsoft-translator-text.p.rapidapi.com/translate";

export const translateText = async (
  text: string,
  to: SupportedLocales
): Promise<string | null> => {
  try {
    await fetch(`${VITE_APP_DOMAIN}/api/`);
    return null;
  } catch (error) {
    console.error("Failed to translate text\n", error);
    return null;
  }
};
