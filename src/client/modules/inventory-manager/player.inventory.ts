import { KeyCode } from "altv-enums";
import { ELEMENT } from "@shared/enums/ui";
import { RPC } from "@shared/constants/rpcs";
import { toggleElement } from "@/utility/user-interface";
import { rpc } from "@/rpc";
import { onKeyDown } from "@/utility/event-helpers";

let isOpen = false;

onKeyDown(KeyCode.B, toggleInventory);

rpc.registerWebview(RPC.Client.EQUIP_ITEM, (slot: number) => {
  return rpc.callServer(RPC.Server.EQUIP_ITEM, slot);
});

rpc.registerWebview(RPC.Client.DROP_ITEM, (slot: number) => {
  return rpc.callServer(RPC.Server.DROP_ITEM, slot);
});

rpc.registerWebview(RPC.Client.MOVE_ITEM, (from: number, to: number) => {
  return rpc.callServer(RPC.Server.MOVE_ITEM, from, to);
});

export function toggleInventory() {
  toggleElement(ELEMENT.INVENTORY, (isOpen = !isOpen));
}
