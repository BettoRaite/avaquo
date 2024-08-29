import styles from "./emailVerificationStatus.module.css";
import { EmailVerificationStatus } from "../AuthProvider";

type EmailVerificationProps = {
  emailVerificationStatus: EmailVerificationStatus;
};

export function EmailVerification({
  emailVerificationStatus,
}: EmailVerificationProps) {
  return (
    <div className={styles.layout}>
      <h3>Let's verify your email!</h3>
      {emailVerificationStatus === "sent" &&
        "Verification email has been sent! Check your inbox or spam."}
      {emailVerificationStatus === "error" &&
        "Ops an unknown error has occured!"}
      {emailVerificationStatus === "idle" &&
        "Please wait, the letter is on the way..."}
    </div>
  );
}
