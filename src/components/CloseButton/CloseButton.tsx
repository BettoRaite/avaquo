import { MdCancel } from "react-icons/md";
import styles from "./closeButton.module.css";

type CloseButtonProps = {
  onClose: () => void;
};

export function CloseButton({ onClose }: CloseButtonProps) {
  return (
    <button className={styles.button} type="button" onClick={onClose}>
      <MdCancel size={"1.5rem"} />
    </button>
  );
}
