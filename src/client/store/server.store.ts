import { defineStore } from "pinia";
import { getDefaultServerStoreState } from "@shared/store/server.store";
import { pinia } from ".";

const useServer = defineStore("server", {
  state: getDefaultServerStoreState,
});

export const serverStore = useServer(pinia);
