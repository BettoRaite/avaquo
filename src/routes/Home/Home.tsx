import styles from "./home.module.css";
import { useState, useEffect } from "react";
import { fetchAdvice } from "../../lib/fetch";
import { AdviceCard } from "../../components/AdviceCard/AdviceCard";
import type { AdviceItem } from "../../lib/utils/types";
import { useLocaleContext } from "../../components/LocaleProvider/localeContext";
import { translateText } from "../../lib/translate";
import { useToastNotificationContext } from "../../components/ToastNotificationProvider/toastNotificationContext";
import { useTranslation } from "react-i18next";

export function Home() {
  const [advice, setAdvice] = useState<AdviceItem | null>(null);
  const { language } = useLocaleContext();
  const { setToastNotification } = useToastNotificationContext();
  const { t } = useTranslation();

  useEffect(() => {
    let isWaitingForResponse = true;

    async function main() {
      if (language !== "en" && isWaitingForResponse && advice) {
        const translated = await translateText(advice.content, language);
        if (translated) {
          setAdvice({
            ...advice,
            content: translated,
          });
        }
      }
    }
    main();
    return () => {
      isWaitingForResponse = false;
    };
  }, [language, advice]);

  useEffect(() => {
    let isWaitingForResponse = true;

    async function init() {
      try {
        const { slip } = await fetchAdvice();
        const { id, advice } = slip;
        let content = advice;

        if (language !== "en" && isWaitingForResponse) {
          const translated = await translateText(content, language);
          if (translated) {
            content = translated;
          }
        }

        if (isWaitingForResponse) {
          setAdvice({
            id,
            content,
          });
        }
      } catch (error) {
        console.error("Failed to fetch advice.\n", error);
        setToastNotification(t("unexpected_error_during_fetch"));
      }
    }
    if (!advice) {
      init();
    }
    return () => {
      isWaitingForResponse = false;
    };
  }, [advice, language, setToastNotification, t]);

  function handleNextAdvice() {
    setAdvice(null);
  }

  return (
    <main className={styles.layout}>
      <AdviceCard adviceItem={advice} onNextAdvice={handleNextAdvice} />
    </main>
  );
}
