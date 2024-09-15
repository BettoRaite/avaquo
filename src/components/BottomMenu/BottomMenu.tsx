import { FaRegCircleUser } from "react-icons/fa6";
import { MdOutlineCollectionsBookmark } from "react-icons/md";
import { LiaSignInAltSolid } from "react-icons/lia";
import { GoHome } from "react-icons/go";
import { MdOutlineMenuOpen } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import styles from "./bottomMenu.module.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthProvider/authContext";
import { handleSignOut } from "../../lib/db/firebase";
import { AppError } from "../../lib/utils/errors";
import type { ContentType } from "../../routes/Root/Root";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/AlertDialog/AlertDialog";

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
          <FaRegCircleUser />
        </button>
        <button
          type="button"
          className={styles.button}
          onClick={handleClick("advice_collection")}
        >
          <MdOutlineCollectionsBookmark />
        </button>
        <Link to={"/"} className={styles.link} onClick={handleClick("none")}>
          <GoHome />
        </Link>
        {user ? (
          <AlertDialog>
            <AlertDialogTrigger className="bg-transparent">
              <div className={styles.button}>
                <IoMdLogOut />
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-dark-grayish-blue border-none">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">
                  Are you sure you want to log out?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-white font-bold text-dark-grayish-blue">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="font-bold hover:bg-white hover:text-dark-grayish-blue transition-all duration-300"
                  onClick={handleLogout}
                >
                  Log out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Link
            to={"/signup"}
            className={styles.link}
            onClick={handleClick("none")}
          >
            <LiaSignInAltSolid />
          </Link>
        )}
      </div>
      <button
        type="button"
        className="text-2xl rounded-full p-4 bg-slate-200 text-gray-500 text-center align-middle active:bg-gray-500 transition duration-200"
        onClick={handleClick()}
      >
        <MdOutlineMenuOpen />
      </button>
    </section>
  );
}
