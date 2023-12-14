import * as alt from "@altv/client";
import { UIElement } from "@shared/enums/ui";
import { doesElementHaveCursor, toggleElement } from "../../webview";

alt.Events.onKeyDown(({ key }) => {
  if (key === alt.Enums.KeyCode.I) {
    toggleElement(UIElement.SKILL_MENU);
  }
});

doesElementHaveCursor.hook((element) => {
  if (element !== UIElement.SKILL_MENU) {
    return;
  }
  return true;
});
