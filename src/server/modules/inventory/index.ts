import alt from "alt-server";
import { ServerEvents } from "@shared/events/server";
import { isValidItem, createItem } from "@shared/modules/items";
import { ServerCall } from "@shared/calls/server";
import { rpc } from "@/rpc";
import { needsToBeInGame } from "@/utility/assertions";
import { registerCmd } from "../chat";
import "./character-data";
import "./items";

registerCmd("additem", (player, [key, amount]) => {
  needsToBeInGame(player);

  if (!isValidItem(key)) {
    return;
  }

  const item = createItem(key, amount ? { amount: +amount } : undefined);

  if (!item) {
    return;
  }

  player.addItem(item);
});

rpc.registerWebview(ServerCall.FromWebview.USE_ITEM, (player, itemSource) => {
  needsToBeInGame(player);

  alt.emit(ServerEvents.FromServer.USE_ITEM, player, itemSource);

  return true;
});

rpc.registerWebview(ServerCall.FromWebview.EQUIP_ITEM, (player, itemSource) => {
  needsToBeInGame(player);

  player.equipItem(itemSource);
  return true;
});

rpc.registerWebview(ServerCall.FromWebview.UNEQUIP_ITEM, (player, equipmentSlot) => {
  needsToBeInGame(player);

  player.unequipItem(equipmentSlot);

  return true;
});

rpc.registerWebview(ServerCall.FromWebview.LOAD_AMMO, (player, sourceA, sourceB) => {
  needsToBeInGame(player);

  player.loadAmmo(sourceA, sourceB);

  return true;
});

rpc.registerWebview(ServerCall.FromWebview.UNLOAD_AMMO, (player, itemSource) => {
  needsToBeInGame(player);

  player.unloadAmmo(itemSource);

  return true;
});

rpc.registerClient(ServerCall.FromClient.RELOAD_WEAPON, (player) => {
  needsToBeInGame(player);

  return player.reloadWeapon();
});

rpc.registerWebview(ServerCall.FromWebview.DROP_ITEM, (player, itemSource) => {
  needsToBeInGame(player);

  alt.emit(ServerEvents.FromServer.DROP_ITEM, itemSource);
  return true;
});

rpc.registerWebview(ServerCall.FromWebview.MOVE_ITEM, (player, from, to) => {
  needsToBeInGame(player);

  const itemInSlotFrom = player.store.character.inventory.items.find(({ slot }) => {
    return slot === from;
  });
  const itemInSlotTo = player.store.character.inventory.items.find(({ slot }) => {
    return slot === to;
  });
  if (itemInSlotFrom && itemInSlotTo) {
    [itemInSlotFrom.slot, itemInSlotTo.slot] = [itemInSlotTo.slot, itemInSlotFrom.slot];
  } else if (itemInSlotFrom) {
    itemInSlotFrom.slot = to;
  } else if (itemInSlotTo) {
    itemInSlotTo.slot = from;
  }
  return true;
});
