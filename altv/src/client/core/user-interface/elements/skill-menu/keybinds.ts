import alt from "@altv/client";
import { UIElement } from "@shared/enums/ui";
import { onKeyDown } from "@/core/user-interface/event-helpers";
import { doesElementHaveCursor, toggleElement } from "../../webview";

onKeyDown(alt.Enums.KeyCode.U, () => {
  toggleElement(UIElement.SKILL_MENU);
});

doesElementHaveCursor.hook((element) => {
  if (element !== UIElement.SKILL_MENU) {
    return;
  }
  return true;
});
