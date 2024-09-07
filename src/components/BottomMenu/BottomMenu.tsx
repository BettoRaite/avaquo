import menuIcon from "/icons/menu-open.svg";
import profileIcon from "/icons/account_circle_icon.svg";
import signUpIcon from "/icons/signup.svg";
import logOutIcon from "/icons/logout.svg";
import collectionIcon from "/icons/collection.svg";
import homeIcon from "/icons/home.svg";
import styles from "./bottonMenu.module.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthProvider/authContext";
import { handleSignOut } from "../../lib/db/firebase";
import { AppError } from "../../lib/utils/errors";
import type { ContentType } from "../../routes/Root/Root";

type BottomMenuProps = {
  onShowContent: (contentType: ContentType) => void;
};

export function BottomMenu({ onShowContent }: BottomMenuProps) {
  const [isContentVisible, setIsContentVisible] = useState(false);
  const { user } = useAuth();
  // [-]: handle errors.
  async function handleLogout() {
    if (!user) {
      throw new AppError(
        "showing sign out button when user does not exist.",
        false
      );
    }
    try {
      await handleSignOut();
    } catch (error) {
      console.error("Unexpected error has occured during sign out.", error);
    }
  }
  function handleClick(content?: ContentType) {
    return () => {
      setIsContentVisible(!isContentVisible);
      if (content) {
        onShowContent(content);
      }
    };
  }
  return (
    <section className={styles.layout}>
      <div
        className={`${styles.contentLayout} ${
          !isContentVisible && styles.contentLayoutHidden
        }`}
      >
        <button
          type="button"
          className={styles.button}
          onClick={handleClick("profile")}
        >
          <img src={profileIcon} alt="toggle profile overlay" />
        </button>
        <button
          type="button"
          className={styles.button}
          onClick={handleClick("advice_collection")}
        >
          <img src={collectionIcon} alt="toggle advice collection overlay" />
        </button>
        <Link to={"/"} className={styles.link} onClick={handleClick("none")}>
          <img src={homeIcon} alt="go to home page" />
        </Link>
        {user ? (
          <button
            type="button"
            onClick={handleLogout}
            className={styles.button}
          >
            <img src={logOutIcon} alt="log out" />
          </button>
        ) : (
          <Link
            to={"/signup"}
            className={styles.link}
            onClick={handleClick("none")}
          >
            <img src={signUpIcon} alt="go to sign up page" />
          </Link>
        )}
      </div>
      <button
        type="button"
        className={styles.button}
        onClick={handleClick()}
        style={{
          boxShadow: "none",
        }}
      >
        <img src={menuIcon} alt="toggle bottom menu content" />
      </button>
    </section>
  );
}
