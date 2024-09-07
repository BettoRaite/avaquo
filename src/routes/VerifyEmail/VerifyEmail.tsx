import styles from "./verifyEmail.module.css";
import { Link } from "react-router-dom";
import { useAuth } from "../../components/AuthProvider/authContext";
import mailIcon from "/public/icons/mail-filled.svg";
import { useState, useEffect, useCallback } from "react";
import { sendVerification } from "../../lib/db/firebase";
import { FIREBASE_ERROR_MESSAGES } from "../../lib/utils/constants";
import { ERROR_MESSAGES } from "../../lib/utils/constants";
import { useTranslation } from "react-i18next";

export type verificationStatus = "sent" | "error" | "loading" | "verified";

export function VerifyEmail() {
  const [verificationStatus, setVerificationStatus] =
    useState<verificationStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const { user, setIsEmailVerified } = useAuth();
  const { t } = useTranslation();

  const handleSendingEmailVerification = useCallback(async () => {
    try {
      const errorObject = await sendVerification();
      if (errorObject) {
        setErrorMessage(
          FIREBASE_ERROR_MESSAGES[errorObject.code] ?? errorObject.message
        );
        setVerificationStatus("error");
        return;
      }
      setVerificationStatus("sent");
    } catch (error) {
      console.error(ERROR_MESSAGES.common.unexpectedError, error);
      setVerificationStatus("error");
    }
  }, []);

  useEffect(() => {
    if (user?.emailVerified) {
      return;
    }
    const intervalId = setInterval(async () => {
      await user?.reload();
      if (user?.emailVerified) {
        setIsEmailVerified(true);
        setVerificationStatus("verified");
      }
    }, 300);
    return () => {
      clearInterval(intervalId);
    };
  }, [user, setIsEmailVerified]);

  useEffect(() => {
    if (user?.emailVerified) {
      setVerificationStatus("verified");
      return;
    }
    if (user) {
      handleSendingEmailVerification();
    }
  }, [user, handleSendingEmailVerification]);

  function handleClick() {
    handleSendingEmailVerification();
  }

  let content = <p>{t("loading_message")}</p>;
  switch (verificationStatus) {
    case "sent": {
      content = (
        <>
          <p>
            {t("verify_account.almost_there")} <br />
            <span className={styles.email}>{user?.email}</span>
          </p>
          <p className={styles.instructions}>
            {t("verify_account.instructions")}{" "}
            <span className={styles.bold}>
              {t("verify_account.check_spam")}
            </span>
          </p>
          <p>{t("verify_account.cant_find")}</p>
          <button type="button" className={styles.button} onClick={handleClick}>
            {t("verify_account.resend_email")}
          </button>
        </>
      );
      break;
    }
    case "error": {
      content = errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
        <p className={styles.errorMessage}>{t("unexpected_error")}</p>
      );
      break;
    }
    case "verified": {
      content = (
        <p>
          {t("verify_account.go_home")}{" "}
          <Link className="form__link" to={"/"}>
            {t("home")}
          </Link>
        </p>
      );
    }
  }
  return (
    <main className={styles.layout}>
      <div className={styles.banner}>
        <img src={mailIcon} alt={t("verify_account.mail_alt")} />
      </div>
      <h3 className={styles.title}>
        {verificationStatus === "verified"
          ? t("verify_account.verified")
          : t("verify_account.verify")}{" "}
      </h3>
      <div className={styles.content}>{content}</div>
    </main>
  );
}
