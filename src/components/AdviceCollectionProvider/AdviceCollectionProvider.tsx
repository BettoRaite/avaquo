import { useEffect, useReducer } from "react";
import { adviceCollectionReducer } from "../../lib/adviceCollectionReducer";
import { useAuth } from "../AuthProvider/authContext";
import {
  AdviceCollectionContext,
  AdviceCollectionDispatchContext,
} from "./adviceCollectionContext";

type AdviceCollectionProviderProps = {
  children: React.ReactNode;
};

export function AdviceCollectionProvider({
  children,
}: AdviceCollectionProviderProps) {
  const [adviceCollection, dispatch] = useReducer(adviceCollectionReducer, []);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      return;
    }
    let ignoreRequest = false;
    async function fetchCollection() {}
    fetchCollection();
    return () => {
      ignoreRequest = true;
    };
  }, [user]);

  return (
    <AdviceCollectionContext.Provider value={adviceCollection}>
      <AdviceCollectionDispatchContext.Provider value={dispatch}>
        {children}
      </AdviceCollectionDispatchContext.Provider>
    </AdviceCollectionContext.Provider>
  );
}
