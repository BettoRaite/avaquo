import styles from "./adviceCollectionOverlay.module.css";
import { useAdviceCollectionContext } from "../AdviceCollectionProvider/adviceCollectionContext";
import { MdCancel } from "react-icons/md";
import { AdviceCollectionCard } from "../AdviceCollectionCard/AdviceCollectionCard";
import { useAppUserContext } from "../AppUserProvider/appUserContext";
import { capitalizeFirstLetter } from "../../lib/utils/strings";
import { LockedContent } from "../LockedContent/LockedContent";
import { useTranslation } from "react-i18next";
import { CloseButton } from "../CloseButton/CloseButton";

type AdviceCollectionOverlayProps = {
  onClose: () => void;
};
export function AdviceCollectionOverlay({
  onClose,
}: AdviceCollectionOverlayProps) {
  const { collection } = useAdviceCollectionContext();
  const { appUser } = useAppUserContext();
  const { t } = useTranslation();

  let content = <LockedContent onClose={onClose} />;

  if (appUser) {
    content = (
      <>
        <div>
          <h1 className={styles.title}>
            {capitalizeFirstLetter(appUser?.name ?? "")}{" "}
            {t("adviceCollection.title")}
          </h1>
          <CloseButton onClose={onClose} />
        </div>

        <div className={styles.cardsLayout}>
          {collection.map((item) => {
            return <AdviceCollectionCard key={item.id} adviceItem={item} />;
          })}
        </div>
      </>
    );
  }

  return (
    <section className={`${styles.layout} ${!appUser && styles.layoutLocked}`}>
      {content}
    </section>
  );
}
