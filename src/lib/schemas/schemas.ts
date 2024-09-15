import { z } from "zod";
import { PASSWORD_MIN_LEN } from "../utils/constants";

const SupportedLocales = z.enum(["ru", "en"]);
export type SupportedLocales = z.infer<typeof SupportedLocales>;

export const userPreferencesSchema = z.object({
  lang: SupportedLocales.optional(),
});

export const apiResponseSchema = z.object({
  slip: z.object({
    id: z.number(),
    advice: z.string(),
  }),
});

export const adviceSchema = z.object({
  content: z.string(),
});

export const appUserSchema = z.object({
  name: z.string(),
  adviceIds: z.array(z.string()),
});

const passwordSchema = z.string().superRefine((password, ctx) => {
  const isLongEnough = password.length >= PASSWORD_MIN_LEN;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasNoRepeatedChars = !/(.)\1{2,}/.test(password);
  if (!isLongEnough) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      minimum: PASSWORD_MIN_LEN,
      type: "number",
      inclusive: true,
      message: "length_error",
    });
  }
  if (!hasUpperCase) {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_string,
      validation: "regex",
      fatal: true,
      message: "uppercase_error",
    });
  }
  if (!hasLowerCase) {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_string,
      validation: "regex",
      fatal: true,
      message: "lowercase_error",
    });
  }
  if (!hasNumber) {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_string,
      validation: "regex",
      fatal: true,
      message: "number_error",
    });
  }
  if (!hasSpecialChar) {
    ctx.addIssue({
      code: z.ZodIssueCode.invalid_string,
      validation: "regex",
      fatal: true,
      message: "special_char_error",
    });
  }
  if (!hasNoRepeatedChars) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "repeated_chars_error",
    });
  }
});

const emailSchema = z
  .string()
  .min(1, { message: "email_must_no_be_empty" })
  .email({ message: "invalid_email_address" });

export const authSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "passwords_did_not_match",
        path: ["confirmPassword"],
      });
    }
  });
