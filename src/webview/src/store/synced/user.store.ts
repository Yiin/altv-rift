import { StoreDefinition } from "pinia";

type UserStore = StoreDefinition<"user", LoadedUser, {}, {}>;

let userStore: UserStore;

export function setUserStore(store: UserStore) {
  userStore = store;
}

export const useUser = () => userStore?.();
