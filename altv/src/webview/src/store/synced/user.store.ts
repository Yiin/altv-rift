import { type StoreDefinition } from "pinia";
import { type User } from "@shared/interfaces";

type UserStore = StoreDefinition<"user", User, {}, {}>;

let userStore: UserStore;

export function setUserStore(store: UserStore) {
  userStore = store;
}

export const useUser = () => userStore?.();
