import { useContext, createContext, type Dispatch } from "react";
import type { AdviceItem } from "../../lib/utils/types";
import type { AdviceCollectionAction } from "../../lib/adviceCollectionReducer";

export function useAdviceCollectionContext() {
  return useContext(AdviceCollectionContext);
}

export function useAdviceCollectionDispatchContext() {
  return useContext(AdviceCollectionDispatchContext);
}

export const AdviceCollectionContext = createContext<AdviceItem[] | null>(null);
export const AdviceCollectionDispatchContext =
  createContext<Dispatch<AdviceCollectionAction> | null>(null);
