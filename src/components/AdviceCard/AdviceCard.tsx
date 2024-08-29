import styles from "./adviceCard.module.css";
import diceIcon from "/icon-dice.svg";
import dividerDesktopView from "/pattern-divider-desktop.svg";
import dividerMobileView from "/pattern-divider-mobile.svg";
import { useAuth } from "../AuthProvider";

type AdviceCardProps = {
  text: string;
  adviceCount?: number;
  onNextAdvice: () => void;
};
const DESKTOP_WIDTH = 768;
export function AdviceCard({
  text,
  adviceCount,
  onNextAdvice,
}: AdviceCardProps) {
  const { user } = useAuth();
  const dividerPath =
    window.innerWidth < DESKTOP_WIDTH ? dividerMobileView : dividerDesktopView;
  return (
    <section className={styles.layout}>
      {adviceCount && (
        <h5 className={styles.adviceCount}>Advice #{adviceCount}</h5>
      )}
      <q className={styles.adviceText}>{text}</q>
      <img
        src={dividerPath}
        alt="advice and button divider"
        className={styles.patternDivider}
      />
      <button className={styles.button} type="button" onClick={onNextAdvice}>
        <img src={diceIcon} alt="get next advice" />
      </button>
      {user?.emailVerified && (
        <button
          className={styles.saveAdviceButton}
          type="button"
          onClick={onNextAdvice}
        >
          Save
        </button>
      )}
    </section>
  );
}
