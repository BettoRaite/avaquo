import accountCircleIcon from "/icons/account_circle_icon.svg";
import signUpIcon from "/icons/signup.svg";
import logOutIcon from "/icons/logout.svg";
import collectionIcon from "/icons/collection.svg";
import homeIcon from "/icons/home.svg";
import styles from "./bottonMenu.module.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthProvider";
import { redirect } from "react-router-dom";
export function BottomMenu() {
  const [isContentVisible, setIsContentVisible] = useState(false);
  const { user, logOut } = useAuth();
  async function handleLogout() {
    try {
      await logOut();
      redirect("/");
    } catch (error) {
      console.error(error);
    }
  }
  function handleToggleContent() {
    setIsContentVisible(!isContentVisible);
  }
  return (
    <section className={styles.layout}>
      <div
        className={`${styles.contentLayout} ${
          !isContentVisible && styles.contentLayoutHidden
        }`}
      >
        <Link to={"/"} className={styles.link} onClick={handleToggleContent}>
          <img src={homeIcon} alt="go to home page" />
        </Link>
        <button type="button" className={styles.toggleAdviceCollectionOverlay}>
          <img src={collectionIcon} alt="toggle advice collection overlay" />
        </button>

        {user ? (
          <button
            type="button"
            onClick={handleLogout}
            className={styles.toggleAdviceCollectionOverlay}
          >
            <img src={logOutIcon} alt="log out" />
          </button>
        ) : (
          <Link
            to={"/signup"}
            className={styles.link}
            onClick={handleToggleContent}
          >
            <img src={signUpIcon} alt="go to sign up page" />
          </Link>
        )}
      </div>
      <button
        type="button"
        className={styles.toggleMenuContentButton}
        onClick={handleToggleContent}
      >
        <img src={accountCircleIcon} alt="toggle bottom menu content" />
      </button>
    </section>
  );
}
