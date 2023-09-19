import alt from "alt-client";
import { KeyCode } from "altv-enums";
import { UIElement } from "@shared/enums/ui";
import { doesElementHaveCursor, toggleElement } from "../../webview";

alt.on("keydown", (key) => {
  if (key === KeyCode.Q) {
    toggleElement(UIElement.QUEST_MENU);
  }
});

doesElementHaveCursor.hook((element) => {
  if (element !== UIElement.QUEST_MENU) {
    return;
  }
  return true;
});
