import styles from "../Signup/signup.module.css";
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Formik, type FieldProps } from "formik";
import { FormField } from "../../components/FormField/FormField";
import { resetPasswordSchema } from "../../lib/schemas/schemas";
import { verifyPasswordResetCode, confirmPasswordReset } from "firebase/auth";
import { auth } from "../../lib/db/firebase";

export function ResetPassword() {
  const [resetPasswordErrorMessage, setResetPasswordErrorMessage] =
    useState("");
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const actionCode = queryParams.get("oobCode");

  return (
    <Formik
      initialValues={{ password: "", confirmPassword: "" }}
      validate={(values) => {
        const result = resetPasswordSchema.safeParse(values);
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
      onSubmit={async ({ password }) => {
        console.log("resetting password");
        try {
          await verifyPasswordResetCode(auth, actionCode as string);
          await confirmPasswordReset(auth, actionCode as string, password);
          console.log("password reset");
        } catch (error) {
          console.error(error);
        }
      }}
    >
      {(props) => (
        <div className={styles.layout}>
          <form onSubmit={props.handleSubmit} className={styles.formLayout}>
            <h1 className={styles.formTitle}>Reset password</h1>

            <FormField
              form={props}
              fieldName="password"
              labelContent="password"
              placeholder="Enter password"
            />
            <FormField
              form={props}
              fieldName="confirmPassword"
              labelContent="confirm password"
              placeholder="Enter confirm password"
              inputProps={{
                type: "password",
              }}
            />

            <button
              className={styles.signUpButton}
              type="submit"
              disabled={props.isSubmitting}
            >
              Reset
            </button>
          </form>
        </div>
      )}
    </Formik>
  );
}
