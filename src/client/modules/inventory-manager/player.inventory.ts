import { KeyCode } from "altv-enums";
import { ServerCall } from "@shared/calls/server";
import { ClientCall } from "@shared/calls/client";
import { ELEMENT } from "@/constants/ui";
import { toggleElement } from "@/utility/user-interface";
import { rpc } from "@/rpc";
import { onKeyDown } from "@/utility/event-helpers";

let isOpen = false;

onKeyDown(KeyCode.B, toggleInventory);

rpc.registerWebview(ClientCall.FromWebview.USE_ITEM, (slot) => {
  return rpc.callServer(ServerCall.FromClient.USE_ITEM, slot);
});

rpc.registerWebview(ClientCall.FromWebview.EQUIP_ITEM, (slot) => {
  return rpc.callServer(ServerCall.FromClient.EQUIP_ITEM, slot);
});

rpc.registerWebview(ClientCall.FromWebview.DROP_ITEM, (slot) => {
  return rpc.callServer(ServerCall.FromClient.DROP_ITEM, slot);
});

export function toggleInventory() {
  toggleElement(ELEMENT.INVENTORY, (isOpen = !isOpen));
}
