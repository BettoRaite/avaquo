import type { AdviceItem } from "../../lib/utils/definitions";
import styles from "./adviceCollectionCard.module.css";
import { MdRemoveCircleOutline } from "react-icons/md";

type AdviceCollectionCardProps = {
  adviceItem: AdviceItem;
};
import { useAppUserHandler } from "../AppUserProvider/appUserContext";
export function AdviceCollectionCard({
  adviceItem,
}: AdviceCollectionCardProps) {
  const { removeAdvice } = useAppUserHandler();
  function handleRemove() {
    removeAdvice(adviceItem);
  }

  return (
    <section className={styles.layout}>
      <button className={styles.button} onClick={handleRemove} type="button">
        <MdRemoveCircleOutline />
      </button>
      <div className={styles.card}>{adviceItem.content}</div>
    </section>
  );
}
