import alt from "alt-client";
import game from "natives";
import { KeyCode } from "altv-enums";
import { computed, reactive, watchEffect } from "vue";
import { ActionItem } from "@shared/store/client.store";
import { ClientEvents } from "@shared/events/client";
import { clientState } from "@/store/client.store";
import { ELEMENT } from "@/constants/ui";
import { getWebview, toggleElement } from "./webview";

type Action = {
  item: ActionItem;
  onSelect(): void;
};

export type ActionRegistration = () => Action[];

const registeredActions: ActionRegistration[] = reactive([]);

export function registerActions(action: ActionRegistration) {
  registeredActions.push(action);
}

const actions = computed(() => registeredActions.map((action) => action()).flat());

watchEffect(() => {
  clientState.actionMenu = actions.value.map(({ item }) => item);
});

function openActionMenu() {
  if (!actions.value.length) {
    return;
  }
  toggleElement(ELEMENT.ACTION_MENU, true);

  getWebview().once(ClientEvents.FromWebview.ACTION_MENU_SELECT, (title) => {
    toggleElement(ELEMENT.ACTION_MENU, false);
    game.playSoundFrontend(-1, "SELECT", "HUD_FREEMODE_SOUNDSET", true);

    const action = actions.value.find(({ item }) => item.title === title);

    if (!action) {
      return;
    }

    action.onSelect();
  });
}

function closeActionMenu() {
  toggleElement(ELEMENT.ACTION_MENU, false);
}

alt.on("keydown", (key) => {
  if (key === KeyCode.Alt) {
    openActionMenu();
  }
});

alt.on("keyup", (key) => {
  if (key === KeyCode.Alt) {
    closeActionMenu();
  }
});
