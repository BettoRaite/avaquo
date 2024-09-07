import styles from "./lockedContent.module.css";
import { MdLockOutline } from "react-icons/md";
import { useAuth } from "../AuthProvider/authContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CloseButton } from "../CloseButton/CloseButton";

type LockedContentProps = {
  onClose: () => void;
};

export function LockedContent({ onClose }: LockedContentProps) {
  const { isEmailVerified, user } = useAuth();
  const { t } = useTranslation();

  let content = (
    <p className={styles.actionHint}>
      <Link
        to={"/signup"}
        className={`form__link ${styles.link}`}
        onClick={onClose}
      >
        {t("locked_content.create_account")}{" "}
      </Link>
    </p>
  );

  if (!isEmailVerified && user) {
    content = (
      <p className={styles.actionHint}>{t("locked_content.verify_account")} </p>
    );
  }

  if (isEmailVerified) {
    content = (
      <p className={styles.actionHint}>
        {t("locked_content.refresh_content")}{" "}
      </p>
    );
  }

  return (
    <section className={styles.layout}>
      <div className={styles.lockWrapper}>
        <MdLockOutline />
      </div>
      {content}
      <CloseButton onClose={onClose} />
    </section>
  );
}
