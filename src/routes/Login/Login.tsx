import styles from "./login.module.css";
import type { ChangeEvent, FormEvent } from "react";
import { FormInput } from "../../components/FormInput/FormInput";
import { useState } from "react";
import { MAX_INPUT_LEN } from "../../lib/contants";
import { signUpSchema } from "../../lib/schemas/schemas";
import { ZodError } from "zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthProvider";
import { Link } from "react-router-dom";

type FormState = {
  email: string;
  password: string;
};

export function Login() {
  const [formState, setFormState] = useState<FormState>({
    email: "",
    password: "",
  });
  const [errorFieldNames, setErrorFieldNames] = useState<string[]>([]);
  const [authErrorMessage, setAuthErrorMessage] = useState<string>("");
  const { email, password } = formState;
  const { signIn } = useAuth();
  const navigate = useNavigate();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    setFormState({
      ...formState,
      [fieldName]: fieldValue,
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate("/");
    } catch (error) {
      if (error instanceof ZodError) {
        const errorObject = error.format();
        const errorFormFields = Object.keys(errorObject._errors);
        setErrorFieldNames(errorFormFields);
      }
      console.error("Failed to sign up", error);
    }
  }

  return (
    <main className={styles.layout}>
      <form className={styles.formLayout} onSubmit={handleSubmit}>
        <FormInput
          value={email}
          onChange={handleChange}
          inputError={{
            showError: errorFieldNames.includes("email"),
            message: "Please enter a valid email address",
          }}
          inputProps={{
            name: "email",
            id: "email",
            maxLength: MAX_INPUT_LEN,
            type: "text",
            autoComplete: "email",
            "aria-describedby": "email-error",
          }}
          label={{
            labelContent: "email address",
            isCapitalized: true,
            isRequired: true,
          }}
        />
        <FormInput
          value={password}
          onChange={handleChange}
          inputError={{
            showError: errorFieldNames.includes("password"),
            message: "Please enter a valid password",
          }}
          inputProps={{
            name: "password",
            id: "password",
            maxLength: MAX_INPUT_LEN,
            type: "password",
            autoComplete: "password",
            "aria-describedby": "password-error",
          }}
          label={{
            labelContent: "password",
            isCapitalized: true,
            isRequired: true,
          }}
        />
        <p>{authErrorMessage}</p>
        <input type="submit" value={"Login"} />
      </form>
    </main>
  );
}
