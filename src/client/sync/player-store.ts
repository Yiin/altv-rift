import alt from "alt-client";
import { KeyCode } from "altv-enums";
import { updateStoreState } from "@shared/store/utils";
import { Events } from "@shared/constants/events";
import { getWebview } from "@/utility/user-interface";
import { playerStore } from "@/store/player.store";
import { onKeyDown } from "@/utility/event-helpers";

alt.onServer(Events.Client.UPDATE_STATE, (event: any) => {
  getWebview().emit(Events.Webview.UPDATE_STATE, event);

  if (
    ![
      "position",
      "heading",
      "rotation",
      "avgPing",
      "velocity",
      "rotationVelocity",
    ].includes(event.key)
  ) {
    alt.log("UPDATE_STATE", event);
  }
  updateStoreState(playerStore, event);
});

alt.onServer(Events.Client.SET_STATE, (state: any) => {
  playerStore.$state = state;
});
