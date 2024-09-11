import styles from "../Signup/signup.module.css";
import { useState } from "react";
import { Formik } from "formik";
import { FormField } from "../../components/FormField/FormField";
import { useTranslation } from "react-i18next";
import { createLocalizedEmailValidator } from "../../lib/validation";
import { handleSendingPasswordResetEmail } from "../../lib/db/firebase";
import { FIREBASE_ERROR_MESSAGES } from "../../lib/utils/constants";
import { capitalizeFirstLetter } from "../../lib/utils/strings";

export function ForgotPassword() {
  const [errorMessage, setErrorMessage] = useState("");
  const { t } = useTranslation();
  return (
    <Formik
      initialValues={{ email: "" }}
      validate={createLocalizedEmailValidator(t)}
      validateOnBlur={false}
      onSubmit={async (values) => {
        try {
          const errorObject = await handleSendingPasswordResetEmail(values);

          if (errorObject) {
            const message =
              FIREBASE_ERROR_MESSAGES[errorObject.code] ?? errorObject.message;
            setErrorMessage(capitalizeFirstLetter(message));
          }
        } catch (error) {
          console.error(
            "Unexpected error during sending reset email has occurred.",
            error
          );
          setErrorMessage(t("unexpected_error"));
        }
      }}
    >
      {(props) => (
        <div className="bg-neon-green p-6 rounded-lg">
          <form onSubmit={props.handleSubmit} className={styles.formLayout}>
            <h1 className="form__title">{t("receive_reset_password_link")}</h1>
            <FormField
              form={props}
              fieldName="email"
              autoComplete="email"
              labelContent={t("email_address")}
              placeholder={t("enter_your_email")}
            />
            <button type="submit" className="form__button m-auto">
              {t("get_link")}
            </button>
            {errorMessage && (
              <p className="form__error-message">{errorMessage}</p>
            )}
          </form>
        </div>
      )}
    </Formik>
  );
}
