import { useEffect, useState } from "react";
import {
  AdviceCollectionContext,
  type LoadStatus,
} from "./adviceCollectionContext";
import { useAppUserContext } from "../AppUserProvider/appUserContext";
import { useAuth } from "../AuthProvider/authContext";
import { getAdviceCollection } from "../../lib/db/firebase";
import type { AdviceItem } from "../../lib/utils/definitions";
import { errorLogger } from "@/lib/utils/errorLogger";
import { AppError } from "@/lib/utils/error";

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
    let isWaitingForResponse = true;
    async function getCollection() {
      if (appUser && isEmailVerified) {
        try {
          setLoadStatus("loading");
          const collection = await getAdviceCollection(appUser);
          if (collection) {
            if (isWaitingForResponse) {
              setAdviceCollection(collection);
              setLoadStatus("idle");
            }
          } else {
            if (isWaitingForResponse) {
              setLoadStatus("error");
            }
          }
        } catch (error) {
          const scopeData: Record<string, unknown> = {
            appUser,
            isEmailVerified,
          };
          if (error instanceof AppError) {
            scopeData.errorScopeData = error.scopeData;
          }
          errorLogger(
            "Unexpected error during advice collection retrival",
            error as Error,
            scopeData
          );
        }
      }
    }

    getCollection();

    return () => {
      isWaitingForResponse = false;
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
