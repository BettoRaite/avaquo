import { authSchema } from "./schemas/schemas";
import type { FormikErrors, FormikValues } from "formik";
import type { TFunction } from "i18next";
import { forgotPasswordSchema } from "./schemas/schemas";

export const createLocalizedAuthValidator = (t: TFunction) => {
  return (values: FormikValues): FormikErrors<FormikValues> => {
    const result = authSchema.safeParse(values);

    if (result.success) {
      return {};
    }

    const formatted = result.error.flatten().fieldErrors;
    const errorFieldNames = Object.keys(formatted) as Array<
      keyof typeof formatted
    >;

    const errors = {} as Record<string, string>;
    for (const name of errorFieldNames) {
      const firstFieldErrorMsg = formatted[name]?.[0] as string;
      errors[name] = t(`${name}_error.${firstFieldErrorMsg}`);
    }

    return errors;
  };
};

export const createLocalizedEmailValidator = (t: TFunction) => {
  return (values: FormikValues): FormikErrors<FormikValues> => {
    const result = forgotPasswordSchema.safeParse(values);

    if (result.success) {
      return {};
    }

    const formatted = result.error.flatten().fieldErrors;
    const errorFieldNames = Object.keys(formatted) as Array<
      keyof typeof formatted
    >;

    const errors = {} as Record<string, string>;
    for (const name of errorFieldNames) {
      const firstFieldErrorMsg = formatted[name]?.[0] as string;
      errors[name] = t(`${name}_error.${firstFieldErrorMsg}`);
    }

    return errors;
  };
};
