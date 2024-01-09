import { User } from "@shared/interfaces";
import { StoreDefinition } from "pinia";

type UserStore = StoreDefinition<"user", User, {}, {}>;

let userStore: UserStore;

export function setUserStore(store: UserStore) {
  userStore = store;
}

export const useUser = () => userStore?.();
