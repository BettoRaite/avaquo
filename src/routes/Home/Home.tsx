import styles from "./home.module.css";
import { useState, useEffect } from "react";
import { AdviceCard } from "../../components/AdviceCard/AdviceCard";
import type { AdviceItem } from "../../lib/utils/definitions";
import { apiResponseSchema } from "@/lib/schemas/schemas";
// import { useLocaleContext } from "../../components/LocaleProvider/localeContext";
// import { translateText } from "../../lib/translate";
import { useToastNotificationContext } from "../../components/ToastNotificationProvider/toastNotificationContext";
import { useTranslation } from "react-i18next";
import { AppError } from "@/lib/utils/error";
import { errorLogger } from "@/lib/utils/errorLogger";

const BASE_URL = "https://api.adviceslip.com/advice";

export function Home() {
  const [advice, setAdvice] = useState<AdviceItem | null>(null);
  // const { language } = useLocaleContext();
  const { setToastNotification } = useToastNotificationContext();
  const { t } = useTranslation();
  // useEffect(() => {
  //   let isWaitingForResponse = true;

  //   async function main() {
  //     if (language !== "en" && isWaitingForResponse && advice) {
  //       const translated = await translateText(advice.content, language);
  //       if (translated) {
  //         setAdvice({
  //           ...advice,
  //           content: translated,
  //         });
  //       }
  //     }
  //   }
  //   main();
  //   return () => {
  //     isWaitingForResponse = false;
  //   };
  // }, [language, advice]);

  useEffect(() => {
    let isWaitingForResponse = true;

    async function getAdvice() {
      try {
        const response = await fetch(BASE_URL, {
          cache: "no-cache",
        });
        const data = await response.json();
        const result = apiResponseSchema.safeParse(data);

        if (result.error) {
          throw new AppError("Invalid api response", false, { data });
        }
        const {
          data: { slip },
        } = result;
        const { id, advice } = slip;

        // if (language !== "en" && isWaitingForResponse) {
        //   const translated = await translateText(content, language);
        //   if (translated) {
        //     content = translated;
        //   }
        // }

        if (isWaitingForResponse) {
          setAdvice({
            id,
            content: advice,
          });
        }
      } catch (error) {
        const scopeData = error instanceof AppError ? error.scopeData : {};
        errorLogger("Unexpected error during fetch", error as Error, scopeData);
        setToastNotification(t("unexpected_error_during_fetch"), "error");
      }
    }
    if (!advice) {
      getAdvice();
    }
    return () => {
      isWaitingForResponse = false;
    };
  }, [advice, setToastNotification, t]);

  function handleNextAdvice() {
    setAdvice(null);
  }

  return (
    <main className={styles.layout}>
      <AdviceCard adviceItem={advice} onNextAdvice={handleNextAdvice} />
    </main>
  );
}
