import { Outlet } from "react-router-dom";
import { BottomMenu } from "../../components/BottomMenu/BottomMenu";
import { useState } from "react";
import { AdviceCollectionOverlay } from "../../components/AdviceCollectionOverlay/AdviceCollectionOverlay";
import { ProfileOverlay } from "../../components/ProfileOverlay/ProfileOverlay";
import styles from "./root.module.css";
import { useLocaleContext } from "../../components/LocaleProvider/localeContext";
import type { SupportedLocales } from "../../lib/schemas/schemas";
import clsx from "clsx";

export type ContentType = "profile" | "advice_collection" | "none";

export function Root() {
  const [contentTypeShown, setContentTypeShown] = useState<ContentType>("none");

  function handleShowContent(contentType: ContentType) {
    if (contentTypeShown === contentType) {
      return setContentTypeShown("none");
    }
    setContentTypeShown(contentType);
  }

  const { setLanguage, language } = useLocaleContext();
  function createLanguageSwitchHandler(lang: SupportedLocales) {
    return () => {
      setLanguage(lang);
    };
  }
  return (
    <main className={styles.layout}>
      {/* <div className={styles.languageSwitchLayout}>
        <button
          className={clsx({
            [styles.active]: language === "ru",
          })}
          type="button"
          onClick={createLanguageSwitchHandler("ru")}
        >
          ru
        </button>
        <button
          className={clsx({
            [styles.active]: language === "en",
          })}
          type="button"
          onClick={createLanguageSwitchHandler("en")}
        >
          eng
        </button>
      </div> */}
      <Outlet />
      {contentTypeShown === "advice_collection" && (
        <AdviceCollectionOverlay
          onClose={() => handleShowContent("advice_collection")}
        />
      )}
      {contentTypeShown === "profile" && (
        <ProfileOverlay onClose={() => handleShowContent("profile")} />
      )}
      <BottomMenu onShowContent={handleShowContent} />
    </main>
  );
}
