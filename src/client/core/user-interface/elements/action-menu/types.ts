import { ActionItem } from "@shared/store/client.store";

export type Action = {
  item: ActionItem;
  onSelect(): void;
};

export type ActionRegistration = () => Action[];
