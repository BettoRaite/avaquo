import { useContext, createContext } from "react";
import type { AdviceItem } from "../../lib/utils/definitions";

export function useAdviceCollectionContext() {
  return useContext(AdviceCollectionContext);
}
export type LoadStatus = "error" | "loading" | "idle";
type AdviceCollectionContextModel = {
  loadStatus: LoadStatus;
  collection: AdviceItem[];
};
export const AdviceCollectionContext =
  createContext<AdviceCollectionContextModel>(
    {} as AdviceCollectionContextModel
  );
