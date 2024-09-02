import { useAppUserContext } from "../AppUserProvider/appUserContext";
import styles from "./adviceCollectionOverlay.module.css";
import { useEffect, useRef, useState } from "react";
// [-]: Read advice collection.

import { getAdviceCollection } from "../../lib/db";
import type { AdviceItem } from "../../lib/utils/types";
const sectionStyle = styles.layout;

type AdviceCollectionOverlayProps = {
  onClose: () => void;
};
type LoadStatus = "error" | "loading" | "idle";
export function AdviceCollectionOverlay({
  onClose,
}: AdviceCollectionOverlayProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [collection, setCollection] = useState<AdviceItem[]>([]);
  const [loadStatus, setLoadStatus] = useState<LoadStatus>("idle");
  const { appUser } = useAppUserContext();

  useEffect(() => {
    let ignoreQuery = false;
    async function getCollection() {
      if (appUser) {
        setLoadStatus("loading");
        const collection = await getAdviceCollection(appUser);
        if (collection) {
          if (!ignoreQuery) {
            setCollection(collection);
            setLoadStatus("idle");
          }
        } else {
          if (!ignoreQuery) {
            setLoadStatus("error");
          }
        }
      }
    }
    getCollection();

    return () => {
      ignoreQuery = true;
      setLoadStatus("idle");
    };
  }, [appUser]);

  useEffect(() => {
    const section = sectionRef.current;
    if (section) {
      section.className = `${sectionStyle} ${styles.layoutVisible}`;
    }
    return () => {
      if (section) {
        section.className = sectionStyle;
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className={sectionStyle}>
      <button type="button" onClick={onClose}>
        close
      </button>
      {collection.map((item) => {
        return <p key={item.id}>{item.content}</p>;
      })}
    </section>
  );
}
