import styles from "./verifyEmail.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthProvider";
import { sendEmailVerification } from "firebase/auth";
import { redirect } from "react-router-dom";

export type verificationState = "sent" | "error" | "loading" | "idle";

export function VerifyEmail() {
  const [verificationStatus, setVerificationStatus] =
    useState<verificationState>("idle");

  const { user } = useAuth();
  if (!user) {
    throw new TypeError("user is null");
  }
  useEffect(() => {
    if (user.emailVerified) {
      redirect("/");
      return;
    }
    setVerificationStatus("loading");
    sendEmailVerification(user)
      .then(() => {
        setVerificationStatus("sent");
      })
      .catch((err) => {
        console.error(err);
        setVerificationStatus("error");
      });
  }, [user]);

  return (
    <main className={styles.layout}>
      <h1>Now, Let's verify your email!</h1>
      {verificationStatus === "loading" && <p>Loading, please wait...</p>}
      {verificationStatus === "sent" && <p>Letter is on the way...</p>}
      {verificationStatus === "error" && <p>Ops...an error has occured!</p>}
    </main>
  );
}
