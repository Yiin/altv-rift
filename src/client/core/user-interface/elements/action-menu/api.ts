import game from "@altv/natives";
import { UIElement } from "@shared/enums/ui";
import { ClientEvents } from "@shared/events/client";
import { toggleElement, useWebview } from "../../webview";
import { actions } from "./action-menu";

export function openActionMenu() {
  if (!actions.value.length) {
    return;
  }
  toggleElement(UIElement.ACTION_MENU, true);

  useWebview().once(ClientEvents.FromWebview.ACTION_MENU_SELECT, (title) => {
    toggleElement(UIElement.ACTION_MENU, false);
    game.playSoundFrontend(-1, "SELECT", "HUD_FREEMODE_SOUNDSET", true);

    const action = actions.value.find(({ item }) => item.title === title);

    if (!action) {
      return;
    }

    action.onSelect();
  });
}

export function closeActionMenu() {
  toggleElement(UIElement.ACTION_MENU, false);
}
