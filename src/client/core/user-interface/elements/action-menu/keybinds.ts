import * as alt from "@altv/client";
import { closeActionMenu, openActionMenu } from "./api";
import { whileInGame } from "@/core/game-state-hooks/in-game.state";

whileInGame(() => {
  const keyDown = alt.Events.onKeyDown(({ key }) => {
    if (key === alt.Enums.KeyCode.ALT) {
      openActionMenu();
    }
  });

  const keyUp = alt.Events.onKeyUp(({ key }) => {
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
