import { KeyCode } from "altv-enums";
import { ELEMENT } from "@shared/enums/ui";
import { onKeyDown } from "@/utility/event-helpers";
import { toggleElement } from "@/utility/user-interface";

// @index('./*.ts', f => `export * from "${f.path}";`)
export * from "./debug-text";
export * from "./request-item";
export * from "./teleport-to-waypoint";
// @endindex

let isOpen = false;

onKeyDown(KeyCode.Z, toggleInventory);
export function toggleInventory() {
  toggleElement(ELEMENT.JSON, (isOpen = !isOpen));
}
