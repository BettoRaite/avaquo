import { getRandInt } from "punyutils";
import { apiResponseSchema } from "./schemas/schemas";

const URL = "https://api.adviceslip.com/advice";
export async function fetchAdvice() {
  /*
  Random advice endpoint does not work correcly,so I had to get advice by id.
  */
  const hardIdLimit = 200;
  const attempts = 10;
  const requestPromises = [];

  for (let i = 0; i < attempts; ++i) {
    const id = getRandInt(0, hardIdLimit);
    requestPromises.push(fetch(`${URL}/${id}`));
  }
  const response = await Promise.any(requestPromises);
  const data = await response.json();
  return apiResponseSchema.parse(data);
}
