import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios from "axios";
import { z } from "zod";
import status from "http-status-codes";

const RAPID_API_KEY = process.env.RAPID_API_KEY;

if (!RAPID_API_KEY) {
  console.warn("NO RAPID_API_KEY");
}

const URL = "https://microsoft-translator-text.p.rapidapi.com/translate";
const HEADERS = {
  "x-rapidapi-key": RAPID_API_KEY,
  "x-rapidapi-host": "microsoft-translator-text.p.rapidapi.com",
  "Content-Type": "application/json",
};
const requestSchema = z.object({
  to: z.string().length(2),
  text: z.string().min(1).max(255),
});

export default async function (
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== "GET") {
    return response.status(status.BAD_REQUEST).send({
      errorMessage: "Unsupported method.",
    });
  }

  const { body } = request;
  const result = requestSchema.safeParse(body);

  if (!result.success) {
    response.status(status.BAD_REQUEST).json({
      errorMessage: result.error,
    });
    return;
  }

  try {
    const { text, to } = result.data;
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
        headers: HEADERS,
      },
    };
    // const res = await axios.post(URL, payload, OPTIONS);

    // const translated = res.data[0].translations[0].text;
    // if (translated) {
    //   response.status(status.OK).json({
    //     text: translated,
    //   });
    //   return;
    // }
    throw new Error("Invalid response.");
  } catch (error) {
    console.error("Failed to translate text\n", error);
    response.status(status.INTERNAL_SERVER_ERROR).json({
      errorMessage: "Internal Server Error",
    });
  }
}
