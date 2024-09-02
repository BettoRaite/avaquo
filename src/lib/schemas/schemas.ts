import { z } from "zod";

export const apiResponseSchema = z.object({
  slip: z.object({
    id: z.number(),
    advice: z.string(),
  }),
});

export const adviceSchema = z.object({
  id: z.number(),
  content: z.string(),
});

export const appUserSchema = z.object({
  name: z.string(),
  adviceIds: z.array(z.number()),
});

export const signUpSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(50, { message: "Name must be at most 50 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password must be at most 100 characters long" })
    .regex(/[a-zA-Z]/, { message: "Password must contain at least one letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
});
