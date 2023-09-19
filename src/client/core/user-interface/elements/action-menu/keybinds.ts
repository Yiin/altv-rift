import alt from "alt-client";
import { KeyCode } from "altv-enums";
import { closeActionMenu, openActionMenu } from "./api";

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

alt.on("windowFocusChange", () => {
  closeActionMenu();
});
