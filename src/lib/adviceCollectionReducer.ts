import type { AdviceItem } from "./utils/types";

export interface AdviceCollectionAction extends Partial<AdviceItem> {
  type: "remove_from_collection" | "add_to_collection" | "make_public";
}

export function adviceCollectionReducer(
  adviceCollection: AdviceItem[],
  action: AdviceCollectionAction
) {
  switch (action.type) {
    case "add_to_collection":
      return adviceCollection;
    case "remove_from_collection":
      return adviceCollection;
    case "make_public":
      return adviceCollection;
  }
}
