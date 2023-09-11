import alt from "@altv/client";
import { StoreDefinition, defineStore } from "pinia";
import { ref } from "vue";
import { updateStoreState } from "@shared/store/utils";
import { ClientEvents } from "@shared/events/client";
import { WebviewEvents } from "@shared/events/webview";
import { User } from "@shared/interfaces";
import { getWebview } from "@/core/user-interface/webview";
import { pinia } from ".";

type UserStore = StoreDefinition<"user", User, {}, {}>;

let userStore: UserStore | undefined;

export const isUserStoreAvailable = ref(false);

export const useUser = () => {
  if (!userStore) {
    throw new Error("User store have not been setup.");
  }
  return userStore(pinia);
};

alt.Events.onServer(ClientEvents.FromServer.UPDATE_USER_STATE, (event: any) => {
  getWebview().emit(WebviewEvents.FromClient.UPDATE_USER_STATE, event);

  const user = useUser();

  updateStoreState(user, event);
});

alt.Events.onServer(ClientEvents.FromServer.SET_USER_STATE, (state: any) => {
  getWebview().emit(WebviewEvents.FromClient.SET_USER_STATE, event);

  if (userStore) {
    const user = useUser();
    user.$dispose();
    delete pinia.state.value[user.$id];
    isUserStoreAvailable.value = false;
  }

  if (state) {
    userStore = defineStore("user", {
      state: () => state,
    });
    isUserStoreAvailable.value = true;
  }
});
