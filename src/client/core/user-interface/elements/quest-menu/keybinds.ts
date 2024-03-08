import alt from "@altv/client";
import { UIElement } from "@shared/enums/ui";
import { onKeyDown } from "@/core/utility/event-helpers";
import { doesElementHaveCursor, toggleElement } from "../../webview";

onKeyDown(alt.Enums.KeyCode.O, () => {
  toggleElement(UIElement.QUEST_MENU);
});

doesElementHaveCursor.hook((element) => {
  if (element !== UIElement.QUEST_MENU) {
    return;
  }
  return true;
});
