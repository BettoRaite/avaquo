import { z } from "zod";
import { MAX_INPUT_LEN } from "../contants";

export const apiResponseSchema = z.object({
  slip: z.object({
    id: z.number(),
    advice: z.string(),
  }),
});
export const signUpSchema = z.object({
  name: z.string().min(4).max(MAX_INPUT_LEN),
  email: z.string().email().max(MAX_INPUT_LEN),
  password: z.string().min(8).max(MAX_INPUT_LEN),
});
