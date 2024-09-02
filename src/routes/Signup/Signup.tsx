import clsx from "clsx";
import styles from "./signup.module.css";
import { useState } from "react";
import { signUpSchema } from "../../lib/schemas/schemas";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../components/AuthProvider/authContext";
import { FirebaseError } from "firebase/app";
import { useAppUserContext } from "../../components/AppUserProvider/appUserContext";
import { Formik, type FieldProps } from "formik";

const FIREBASE_ERRORS: Record<string, string | undefined> = {
  "auth/email-already-in-use": "A user with that email already exists",
};

interface FormFieldProps extends Pick<FieldProps, "form"> {
  fieldName: string;
  labelContent: string;
  placeholder: string;
  autoComplete?: string;
}
/**
 * A Formik form field component designed to accept a
 * fieldName and apply it to all necessary input props.
 * This approach helps us adhere to the DRY (Don't Repeat Yourself) principle.
 */
export function FormField({
  form: { isSubmitting, values, handleChange, handleBlur, touched, errors },
  fieldName,
  labelContent,
  placeholder,
  autoComplete,
}: FormFieldProps) {
  return (
    <div className={styles.formField}>
      <label className={styles.formLabel} htmlFor={fieldName}>
        {labelContent}
      </label>
      <input
        disabled={isSubmitting}
        id={fieldName}
        name={fieldName}
        type={fieldName}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={values[fieldName]}
        onChange={handleChange}
        onBlur={handleBlur}
        className={clsx(styles.formInput, {
          [styles.formInputError]: errors[fieldName] && touched[fieldName],
        })}
        aria-describedby={
          errors[fieldName] && touched[fieldName] ? `${fieldName}-error` : ""
        }
      />
      {errors[fieldName] && touched[fieldName] && (
        <span
          className={styles.invalidInputHint}
          id={`${fieldName}-error`}
          role="alert"
          aria-live="assertive"
        >
          {errors[fieldName] as string}
        </span>
      )}
    </div>
  );
}

export function Signup() {
  const [authErrorMessage, setAuthErrorMessage] = useState("");
  const { signUp } = useAuth();
  const { initAppUser } = useAppUserContext();
  // [-]: If user is logged in redirect to verify page.
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{ name: "", email: "", password: "" }}
      validate={(values) => {
        const result = signUpSchema.safeParse(values);
        if (result.success) {
          return {};
        }
        const formatted = result.error.flatten().fieldErrors as Record<
          string,
          string[]
        >;
        const errors: Record<string, string> = {};
        for (const fieldName of Object.keys(formatted)) {
          errors[fieldName] = formatted[fieldName]?.[0];
        }
        return errors;
      }}
      onSubmit={async (values) => {
        try {
          const { name, email, password } = values;
          await signUp(email, password);
          initAppUser({
            name,
            adviceIds: [],
          });

          navigate("/verify");
        } catch (error) {
          if (error instanceof FirebaseError) {
            const expectedErrorMsg = FIREBASE_ERRORS[error.code];
            const errorMsg =
              expectedErrorMsg ??
              `Unexpected error has occured: ${error.message}`;
            setAuthErrorMessage(errorMsg);
            if (!expectedErrorMsg) {
              console.error("Failed to sign up user.\n", error);
            }
            return;
          }
          console.error("Unexpected error during user sign-up.\nError:", error);
          throw error;
        }
      }}
    >
      {(props) => (
        <div className={styles.layout}>
          <form onSubmit={props.handleSubmit} className={styles.formLayout}>
            <h1 className={styles.formTitle}>Create an account</h1>
            <FormField
              form={props}
              fieldName="name"
              autoComplete="name"
              labelContent="User name"
              placeholder="Enter your name"
            />

            <FormField
              form={props}
              fieldName="email"
              autoComplete="email"
              labelContent="email address"
              placeholder="Enter your email"
            />

            <FormField
              form={props}
              fieldName="password"
              labelContent="password"
              placeholder="Enter your password"
            />
            {authErrorMessage && (
              <p className={styles.authErrorMessage}>{authErrorMessage}</p>
            )}
            <button
              className={styles.signUpButton}
              type="submit"
              disabled={props.isSubmitting}
            >
              Sign up
            </button>
            <p className={styles.loginLink}>
              Already have an account? <Link to={"/login"}>Log in</Link>
            </p>
          </form>
        </div>
      )}
    </Formik>
  );
}
/*
  <main className={styles.layout}>
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
            message: formErrorState.email,
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


*/
