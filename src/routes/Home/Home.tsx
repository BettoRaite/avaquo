import styles from "./home.module.css";
import { useState, useEffect } from "react";
import { fetchAdvice } from "../../lib/fetch";
import { AdviceCard } from "../../components/AdviceCard/AdviceCard";
import { useAppUserContext } from "../../components/AppUserProvider/appUserContext";
import type { AdviceItem } from "../../lib/utils/types";

export function Home() {
  const [advice, setAdvice] = useState<AdviceItem | null>(null);
  const [refetch, setRefetch] = useState(false);
  const { saveAdvice } = useAppUserContext();
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    let ignoreRequest = false;

    async function main() {
      try {
        const { slip } = await fetchAdvice();
        if (!ignoreRequest) {
          setAdvice({
            id: slip.id,
            content: slip.advice,
          });
        }
      } catch (error) {
        console.error("Failed to fetch advice.", error);
      }
    }
    main();
    return () => {
      ignoreRequest = true;
    };
  }, [refetch]);
  function handleNextAdvice() {
    setRefetch(!refetch);
  }

  async function handleSaveAdvice() {
    try {
      if (advice) {
        await saveAdvice(advice);
      }
    } catch (error) {
      console.error("Failed to save advice", error);
    }
  }
  return (
    <main className={styles.layout}>
      <AdviceCard
        text={advice?.content ?? ""}
        adviceCount={advice?.id}
        onNextAdvice={handleNextAdvice}
        onSaveAdvice={handleSaveAdvice}
      />
    </main>
  );
}
