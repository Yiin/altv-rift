import alt from "@altv/client";
import { whileInGame } from "@/core/game-state-hooks/in-game.state";
import { closeActionMenu, openActionMenu } from "./api";
import { isTyping } from "../../event-helpers";

whileInGame(() => {
  const keyDown = alt.Events.onKeyDown(({ key }) => {
    if (isTyping()) {
      return;
    }
    if (key === alt.Enums.KeyCode.ALT) {
      openActionMenu();
    }
  });

  const keyUp = alt.Events.onKeyUp(({ key }) => {
    if (isTyping()) {
      return;
    }
    if (key === alt.Enums.KeyCode.ALT) {
      closeActionMenu();
    }
  });

  const windowFocusChange = alt.Events.onWindowFocusChange(() => {
    closeActionMenu();
  });

  return () => {
    keyDown.destroy();
    keyUp.destroy();
    windowFocusChange.destroy();
  };
});
