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
  const [advice, setAdvice] = useState<AdviceItem>({
    content: "",
    id: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const { language } = useLocaleContext();
  const { setToastNotification } = useToastNotificationContext();
  const { t } = useTranslation();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    let ignoreRequest = false;

    async function fetchAdviceData() {
      try {
        setIsLoading(true);
        const { slip } = await fetchAdvice();
        const { id, advice } = slip;
        let content = advice;

        if (language !== "en" && !ignoreRequest) {
          const translated = await translateText(content, language);
          if (translated) {
            content = translated;
          }
        }

        if (!ignoreRequest) {
          setAdvice({
            id,
            content,
          });
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch advice.\n", error);
        setToastNotification(t("unexpected_error_during_fetch"));
      }
    }

    fetchAdviceData();

    return () => {
      ignoreRequest = true;
    };
  }, [refetch, language, setToastNotification, t]);

  function handleNextAdvice() {
    setRefetch((prev) => !prev);
  }

  return (
    <main className={styles.layout}>
      <AdviceCard
        adviceItem={{} as AdviceItem}
        onNextAdvice={handleNextAdvice}
        isLoading={true}
      />
    </main>
  );
}
