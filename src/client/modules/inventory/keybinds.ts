import { KeyCode } from "altv-enums";
import { ELEMENT } from "@/core/constants/ui";
import { toggleElement } from "@/core/user-interface/webview";
import { onKeyDown } from "@/core/utility/event-helpers";

let isOpen = false;

onKeyDown(KeyCode.B, toggleInventory);

export function toggleInventory() {
  toggleElement(ELEMENT.INVENTORY, (isOpen = !isOpen));
}
