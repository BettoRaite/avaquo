import { useEffect, useState } from "react";
import {
  AdviceCollectionContext,
  type LoadStatus,
} from "./adviceCollectionContext";
import { useAppUserContext } from "../AppUserProvider/appUserContext";
import { useAuth } from "../AuthProvider/authContext";
import { getAdviceCollection } from "../../lib/db/firebase";
import type { AdviceItem } from "../../lib/utils/types";

type AdviceCollectionProviderProps = {
  children: React.ReactNode;
};

export function AdviceCollectionProvider({
  children,
}: AdviceCollectionProviderProps) {
  const [adviceCollection, setAdviceCollection] = useState<AdviceItem[]>([]);
  const [loadStatus, setLoadStatus] = useState<LoadStatus>("idle");
  const { appUser } = useAppUserContext();
  const { isEmailVerified } = useAuth();

  useEffect(() => {
    // [-]: No error handling.
    let ignoreQuery = false;
    async function getCollection() {
      if (appUser && isEmailVerified) {
        setLoadStatus("loading");
        const collection = await getAdviceCollection(appUser);
        if (collection) {
          if (!ignoreQuery) {
            setAdviceCollection(collection);
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
  }, [appUser, isEmailVerified]);
  const value = {
    loadStatus,
    collection: adviceCollection,
  };
  return (
    <AdviceCollectionContext.Provider value={value}>
      {children}
    </AdviceCollectionContext.Provider>
  );
}
