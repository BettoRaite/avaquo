import styles from "./home.module.css";
import { useState, useEffect } from "react";
import { getAdvice } from "../../lib/fetch";
import { BottomMenu } from "../../components/BottomMenu/BottomMenu";
import { AdviceCard } from "../../components/AdviceCard/AdviceCard";

type Advice = {
  id?: number;
  text: string;
};
export function Home() {
  const [advice, setAdvice] = useState<Advice>({
    text: "",
  });
  const [refetch, setRefetch] = useState(false);
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    let ignoreRequest = false;

    async function main() {
      try {
        const { slip } = await getAdvice();
        if (!ignoreRequest) {
          setAdvice({
            id: slip.id,
            text: slip.advice,
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
  return (
    <main className={styles.layout}>
      <AdviceCard
        text={advice.text}
        adviceCount={advice?.id}
        onNextAdvice={handleNextAdvice}
      />
      <BottomMenu />
    </main>
  );
}
