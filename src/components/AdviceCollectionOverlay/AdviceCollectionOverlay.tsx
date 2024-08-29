import { useAdviceCollectionContext } from "../AdviceCollectionProvider/AdviceCollectionProvider";
import styles from "./adviceCollectionOverlay.module.css";

export function AdviceCollectionOverlay() {
  const collection = useAdviceCollectionContext();
  return <section className={styles.layout}>collection</section>;
}
