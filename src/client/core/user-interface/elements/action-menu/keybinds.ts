import * as alt from "@altv/client";
import { closeActionMenu, openActionMenu } from "./api";

alt.Events.onKeyDown(({ key }) => {
  if (key === alt.Enums.KeyCode.ALT) {
    openActionMenu();
  }
});

alt.Events.onKeyUp(({ key }) => {
  if (key === alt.Enums.KeyCode.ALT) {
    closeActionMenu();
  }
});

alt.Events.onWindowFocusChange(() => {
  closeActionMenu();
});
