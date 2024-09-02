import styles from "./verifyEmail.module.css";
import { useEffect, useState } from "react";
import { Link, redirect } from "react-router-dom";
import { useAuth } from "../../components/AuthProvider/authContext";

export type verificationState =
  | "sent"
  | "error"
  | "loading"
  | "idle"
  | "verified";

export function VerifyEmail() {
  const [verificationStatus, setVerificationStatus] =
    useState<verificationState>("idle");
  const { user, verify } = useAuth();
  useEffect(() => {
    let intervalId: number | undefined;
    async function init() {
      setVerificationStatus("loading");
      try {
        if (user) {
          if (user.emailVerified) {
            redirect("/");
            return;
          }

          if (await verify()) {
            setVerificationStatus("sent");
            intervalId = setInterval(() => {
              user.reload().then(() => {
                if (user.emailVerified) {
                  setVerificationStatus("verified");
                }
              });
            }, 100);
            return;
          }
          setVerificationStatus("error");
        }
      } catch (error) {
        console.error("Failed to verify user email", error);
      }
    }
    init();
    return () => {
      clearInterval(intervalId);
    };
  }, [verify, user]);
  return (
    <main className={styles.layout}>
      <h1>Now, Let's verify your email!</h1>
      {verificationStatus === "loading" && <p>Loading, please wait...</p>}
      {verificationStatus === "sent" && <p>Check your inbox or spam</p>}
      {verificationStatus === "error" && <p>Ops...an error has occured!</p>}
      {verificationStatus === "verified" && (
        <p>
          Verified <Link to={"/"}>Go back</Link>
        </p>
      )}
    </main>
  );
}
