import { Enums } from "@altv/client";
import { ELEMENT } from "@/core/constants/ui";
import { toggleElement } from "@/core/user-interface/webview";
import { onKeyDown } from "@/core/utility/event-helpers";

let isOpen = false;

onKeyDown(Enums.KeyCode.B, toggleInventory);

export function toggleInventory() {
  toggleElement(ELEMENT.INVENTORY, (isOpen = !isOpen));
}
