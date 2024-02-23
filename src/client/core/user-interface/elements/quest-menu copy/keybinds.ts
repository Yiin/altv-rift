import alt from "@altv/client";
import { UIElement } from "@shared/enums/ui";
import { doesElementHaveCursor, toggleElement } from "../../webview";

alt.Events.onKeyDown(({ key }) => {
  if (key === alt.Enums.KeyCode.O) {
    toggleElement(UIElement.QUEST_MENU);
  }
});

doesElementHaveCursor.hook((element) => {
  if (element !== UIElement.QUEST_MENU) {
    return;
  }
  return true;
});
