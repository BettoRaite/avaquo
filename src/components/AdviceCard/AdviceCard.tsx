import clsx from "clsx";
import styles from "./adviceCard.module.css";
import diceIcon from "/icon-dice.svg";
import dividerDesktopView from "/pattern-divider-desktop.svg";
import dividerMobileView from "/pattern-divider-mobile.svg";
import { useAuth } from "../AuthProvider/authContext";
import { useAdviceCollectionContext } from "../AdviceCollectionProvider/adviceCollectionContext";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import type { AdviceItem } from "../../lib/utils/types";
import { useAppUserHandler } from "../AppUserProvider/appUserContext";
import { useTranslation } from "react-i18next"; // Import useTranslation

type AdviceCardProps = {
  adviceItem: AdviceItem;
  onNextAdvice: () => void;
};

const DESKTOP_WIDTH = 768;

export function AdviceCard({ onNextAdvice, adviceItem }: AdviceCardProps) {
  const { user } = useAuth();
  const { content, id: adviceCount } = adviceItem;
  const { t } = useTranslation(); // Use the translation hook

  const dividerPath =
    window.innerWidth < DESKTOP_WIDTH ? dividerMobileView : dividerDesktopView;

  const { collection } = useAdviceCollectionContext();
  const { removeAdvice, saveAdvice } = useAppUserHandler();

  const existInCollection = collection.find((item) => item.content === content);

  return (
    <section className={styles.layout}>
      {adviceCount && (
        <h5 className={styles.adviceCount}>
          {t("advice_card.advice_count")} {adviceCount}
        </h5>
      )}
      <q className={styles.adviceText}>{content}</q>
      <img
        src={dividerPath}
        alt={t("advice_card.divider_alt")}
        className={styles.patternDivider}
      />
      <div className={styles.buttonsLayout}>
        <button className={styles.button} type="button" onClick={onNextAdvice}>
          <img src={diceIcon} alt={t("advice_card.get_next_advice")} />{" "}
        </button>
        {user?.emailVerified && (
          <button
            className={clsx(styles.saveAdviceButton, {
              [styles.saveAdviceButtonActive]: existInCollection,
            })}
            type="button"
            onClick={
              existInCollection
                ? () => removeAdvice(adviceItem)
                : () => saveAdvice(adviceItem)
            }
          >
            {existInCollection ? <AiFillLike /> : <AiOutlineLike />}
          </button>
        )}
      </div>
    </section>
  );
}
