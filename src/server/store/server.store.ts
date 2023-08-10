import { createPinia, defineStore } from "pinia";
import { getDefaultServerStoreState } from "@shared/store/server.store";

export const pinia = createPinia();

const useServer = defineStore("server", {
  state: getDefaultServerStoreState,
});

export const serverStore = useServer(pinia);
