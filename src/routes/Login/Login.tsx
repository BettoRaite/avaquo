import { capitalizeFirstLetter } from "../../lib/utils/strings";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../components/AuthProvider/authContext";
import { Formik } from "formik";
import { FormField } from "../../components/FormField/FormField";
import { FIREBASE_ERROR_MESSAGES } from "../../lib/utils/constants";
import { handleEmailPasswordSignIn } from "../../lib/db/firebase";
import { createLocalizedAuthValidator } from "../../lib/validation";
import { useTranslation } from "react-i18next";

export function Login() {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useTranslation();
  const validator = createLocalizedAuthValidator(t);

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validate={validator}
      validateOnChange={true}
      validateOnBlur={false}
      onSubmit={async (values, { setErrors }) => {
        try {
          if (user) {
            setErrorMessage("You are already signed in.");
            return;
          }
          const errors = validator(values);
          if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
          }

          const errorObject = await handleEmailPasswordSignIn(values);

          if (errorObject) {
            const message =
              FIREBASE_ERROR_MESSAGES[errorObject.code] ?? errorObject.message;
            setErrorMessage(capitalizeFirstLetter(message));
          } else {
            navigate("/");
          }
        } catch (error) {
          console.error("Unexpected error during log-in has occured.", error);
          setErrorMessage(t("unexpected_error"));
        }
      }}
    >
      {(props) => (
        <div className={"form-wrapper"}>
          <form onSubmit={props.handleSubmit} className={"form__layout"}>
            <h1 className={"form__title"}>{t("log_in")}</h1>{" "}
            {/* Translated title */}
            <FormField
              form={props}
              fieldName="email"
              autoComplete="email"
              labelContent={t("email_address")} // Translated label
              placeholder={t("enter_your_email")} // Translated placeholder
            />
            <FormField
              form={props}
              fieldName="password"
              labelContent={t("password")} // Translated label
              placeholder={t("enter_your_password")} // Translated placeholder
            />
            <Link
              className="form__link"
              style={{
                fontSize: "0.8rem",
              }}
              to={"/forgotPassword"}
            >
              {t("forgot_password")}{" "}
              {/* Add this key to your translation file */}
            </Link>
            {errorMessage && (
              <p className={"form__error-message"}>{errorMessage}</p>
            )}
            <button
              className={"form__submit-button"}
              type="submit"
              disabled={props.isSubmitting}
            >
              {t("log_in")} {/* Translated button text */}
            </button>
            <p className={"form__link-wrapper"}>
              {t("already_have_account")} {/* Translated text */}
              <Link className="form__link" to={"/signup"}>
                {t("create_an_account")} {/* Translated link text */}
              </Link>
            </p>
          </form>
        </div>
      )}
    </Formik>
  );
}
