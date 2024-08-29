import styles from "./signup.module.css";
import type { ChangeEvent, FormEvent } from "react";
import { FormInput } from "../../components/FormInput/FormInput";
import { useState } from "react";
import { MAX_INPUT_LEN } from "../../lib/contants";
import { signUpSchema } from "../../lib/schemas/schemas";
import { ZodError } from "zod";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../components/AuthProvider";
import { FirebaseError } from "firebase/app";
import { Link } from "react-router-dom";

const FIREBASE_ERRORS: Record<string, string | undefined> = {
  "auth/email-already-in-use": "A user with that email already exists",
  "auth/weak-password":
    "Please check your password. It should be 6+ characters",
};

type FormState = {
  name: string;
  email: string;
  password: string;
};

export function Signup() {
  const [formState, setFormState] = useState<FormState>({
    name: "",
    email: "",
    password: "",
  });
  const [errorFieldNames, setErrorFieldNames] = useState<string[]>([]);
  const [authErrorMessage, setAuthErrorMessage] = useState<string>("");
  const { name, email, password } = formState;
  const { signUp } = useAuth();
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
      signUpSchema.parse(formState);
      await signUp(email, password);
      navigate("/verify");
    } catch (error) {
      if (error instanceof ZodError) {
        const errorObject = error.format();
        const errorFormFields = Object.keys(errorObject._errors);
        setErrorFieldNames(errorFormFields);
      }
      if (error instanceof FirebaseError) {
        setAuthErrorMessage(FIREBASE_ERRORS[error.code] as string);
        console.error("Failed to sign up", error);
      }
    }
  }

  return (
    <main className={styles.layout}>
      <Link className="go-back-link" to={"/"}>
        Go back
      </Link>
      <form className={styles.formLayout} onSubmit={handleSubmit}>
        <FormInput
          value={name}
          onChange={handleChange}
          inputError={{
            showError: errorFieldNames.includes("name"),
            message: "Please enter a name",
          }}
          inputProps={{
            name: "name",
            id: "name",
            maxLength: MAX_INPUT_LEN,
            type: "text",
            "aria-describedby": "name-error",
          }}
          label={{
            labelContent: "your name",
            isCapitalized: true,
            isRequired: true,
          }}
        />
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
            type: "text",
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
        <input type="submit" value={"Sign up"} />
        <p>
          Already have an account?
          <Link to={"/login"}>Login</Link>
        </p>
      </form>
    </main>
  );
}
