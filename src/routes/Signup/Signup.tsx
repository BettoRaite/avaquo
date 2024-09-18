import { capitalizeFirstLetter } from "../../lib/utils/strings";
import styles from "./signup.module.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  handleEmailPasswordSignUp,
  handleSignInWithPopup,
} from "../../lib/db/firebase";
import { Formik, Form } from "formik";
import { FIREBASE_ERROR_MESSAGES } from "../../lib/utils/constants";
import { useTranslation } from "react-i18next";
import { createLocalizedAuthValidator } from "../../lib/validation";
import { FormField } from "../../components/FormField/FormField";
import { ERROR_MESSAGES } from "../../lib/utils/constants";
import { AuthWithProviderButton } from "../../components/AuthWithProviderButton/AuthWithProviderButton";
import { Divider } from "@/components/Divider/Divider";
import { errorLogger } from "@/lib/utils/errorLogger";
import { FirebaseError } from "firebase/app";

export function Signup() {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();
  const validator = createLocalizedAuthValidator(t);

  async function handleSignInWithGoogle() {
    try {
      const errorObject = await handleSignInWithPopup("google");

      if (errorObject) {
        const message =
          FIREBASE_ERROR_MESSAGES[errorObject.code] ?? errorObject.message;
        setErrorMessage(capitalizeFirstLetter(message));
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error(ERROR_MESSAGES, error);
    }
  }

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validate={validator}
      validateOnChange={true}
      validateOnBlur={false}
      onSubmit={async (credentials, { setErrors }) => {
        try {
          const errors = validator(credentials);
          if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
          }

          await handleEmailPasswordSignUp(credentials);
          navigate("/verify");
        } catch (error) {
          errorLogger(
            "Unexpected error during sign-up has occurred.",
            error as Error,
            credentials
          );

          if (error instanceof FirebaseError) {
            const message =
              FIREBASE_ERROR_MESSAGES[error.code] ?? error.message;
            setErrorMessage(capitalizeFirstLetter(message));
          } else {
            setErrorMessage(t("unexpected_error"));
          }
        }
      }}
    >
      {(props) => (
        <div className={styles.layout}>
          <Form className="form__layout">
            <h1 className="form__title">{t("create_an_account")}</h1>

            <FormField
              form={props}
              fieldName="email"
              labelContent={t("email_address")}
              placeholder={t("enter_your_email")}
              inputProps={{ autoComplete: "email" }}
            />
            <FormField
              form={props}
              fieldName="password"
              labelContent={t("password")}
              placeholder={t("enter_your_password")}
              inputProps={{ autoComplete: "current-password" }}
            />
            {errorMessage && (
              <p className="form__error-message">{errorMessage}</p>
            )}
            <button
              className="form__submit-button"
              type="submit"
              disabled={props.isSubmitting}
            >
              {t("sign_up")}
            </button>

            <p className="form__link-wrapper">
              {t("already_have_account")}{" "}
              <Link className="form__link" to="/login">
                {t("log_in")}
              </Link>
            </p>
            <Divider text="or" />
            <AuthWithProviderButton
              provider="google"
              onClick={handleSignInWithGoogle}
            />
          </Form>
        </div>
      )}
    </Formik>
  );
}
