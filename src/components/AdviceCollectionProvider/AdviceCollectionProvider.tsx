import {
  useContext,
  createContext,
  useEffect,
  useReducer,
  type Dispatch,
} from "react";
import type { AdviceItem } from "../../lib/utils/types";
import { adviceCollectionReducer } from "../../lib/adviceCollectionReducer";
import type { AdviceCollectionAction } from "../../lib/adviceCollectionReducer";
import { useAuth } from "../AuthProvider";

export function useAdviceCollectionContext() {
  return useContext(AdviceCollectionContext);
}

export function useAdviceCollectionDispatchContext() {
  return useContext(AdviceCollectionDispatchContext);
}

const AdviceCollectionContext = createContext<AdviceItem[] | null>(null);
const AdviceCollectionDispatchContext =
  createContext<Dispatch<AdviceCollectionAction> | null>(null);
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
