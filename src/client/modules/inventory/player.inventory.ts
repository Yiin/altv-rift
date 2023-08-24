import { KeyCode } from "altv-enums";
import { ELEMENT } from "@/constants/ui";
import { toggleElement } from "@/utility/user-interface";
import { onKeyDown } from "@/utility/event-helpers";

let isOpen = false;

onKeyDown(KeyCode.B, toggleInventory);

export function toggleInventory() {
  toggleElement(ELEMENT.INVENTORY, (isOpen = !isOpen));
}
