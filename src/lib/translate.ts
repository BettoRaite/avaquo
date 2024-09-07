import axios from "axios";
import type { SupportedLocales } from "./schemas/schemas";
const { VITE_RAPID_API_KEY } = import.meta.env;

const URL = "https://microsoft-translator-text.p.rapidapi.com/translate";

export const translateText = async (
  text: string,
  to: SupportedLocales
): Promise<string | null> => {
  try {
    const payload = [
      {
        text,
      },
    ];

    const OPTIONS = {
      params: {
        "api-version": "3.0",
        profanityAction: "NoAction",
        textType: "plain",
        from: "en",
        to: to,
      },
      headers: {
        "x-rapidapi-key": VITE_RAPID_API_KEY,
        "x-rapidapi-host": "microsoft-translator-text.p.rapidapi.com",
        "Content-Type": "application/json",
      },
    };

    const response = await axios.post(URL, payload, OPTIONS);
    const translated = response.data[0].translations[0].text;
    if (typeof translated === "string") {
      return translated;
    }
    return null;
  } catch (error) {
    console.error("Failed to translate text\n", error);
    return null;
  }
};
