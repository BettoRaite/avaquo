import styles from "../Signup/signup.module.css";
import { useState } from "react";
import { Formik, type FieldProps } from "formik";
import { FormField } from "../../components/FormField/FormField";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../lib/db/firebase";

export function ForgotPassword() {
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  // const navigate = useNavigate();

  return (
    <Formik
      initialValues={{ email: "" }}
      validate={(values) => {}}
      onSubmit={async (values) => {
        try {
          const { email } = values;
          await sendPasswordResetEmail(auth, email, {
            url: `http://localhost:5173/resetPassword?email=${email}`,
            dynamicLinkDomain: `http://localhost:5173/resetPassword?email=${email}`,
          });
        } catch (error) {
          console.error(error);
        }
      }}
    >
      {(props) => (
        <div className={styles.layout}>
          <form onSubmit={props.handleSubmit} className={styles.formLayout}>
            <h1 className={styles.formTitle}>Receive reset password link</h1>
            <FormField
              form={props}
              fieldName="email"
              autoComplete="email"
              labelContent="email address"
              placeholder="Enter your email"
            />
            <button type="submit">Get link</button>
          </form>
        </div>
      )}
    </Formik>
  );
}
