import { defineStore } from "pinia";
import { getDefaultClientStoreState } from "@shared/store/client.store";
import { readonly } from "@shared/utility/readonly";

export const useClient = defineStore("client", {
  state: readonly(getDefaultClientStoreState),
});
