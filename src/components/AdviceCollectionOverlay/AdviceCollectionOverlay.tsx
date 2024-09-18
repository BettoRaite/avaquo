import styles from "./adviceCollectionOverlay.module.css";
import { useAdviceCollectionContext } from "../AdviceCollectionProvider/adviceCollectionContext";
import { AdviceCollectionCard } from "../AdviceCollectionCard/AdviceCollectionCard";
import { useAppUserContext } from "../AppUserProvider/appUserContext";
import { capitalizeFirstLetter } from "../../lib/utils/strings";
import { LockedContent } from "../LockedContent/LockedContent";
import { useTranslation } from "react-i18next";
import { CloseButton } from "../CloseButton/CloseButton";
import { CircleLoader } from "../CircleLoader";
import clsx from "clsx";

type AdviceCollectionOverlayProps = {
  onClose: () => void;
};
export function AdviceCollectionOverlay({
  onClose,
}: AdviceCollectionOverlayProps) {
  const { collection } = useAdviceCollectionContext();
  const { appUser, isLoading } = useAppUserContext();
  const { t } = useTranslation();

  let content = <LockedContent onClose={onClose} />;

  if (appUser) {
    content = (
      <>
        <h1 className={styles.title}>
          {capitalizeFirstLetter(appUser?.name ?? "")}
          {t("adviceCollection.title")}
        </h1>
        <div className={styles.cardsLayout}>
          {collection.map((item) => {
            return <AdviceCollectionCard key={item.id} adviceItem={item} />;
          })}
        </div>
      </>
    );
  }
  if (isLoading) {
    content = (
      <div className="flex justify-center items-center">
        <CircleLoader />
      </div>
    );
  }

  return (
    <section
      className={clsx(styles.layout, {
        "grid-rows-[auto_1fr]": appUser,
      })}
    >
      <CloseButton onClose={onClose} />
      {content}
    </section>
  );
}
