import alt from "alt-server";
import { ServerEvents } from "@shared/events/server";
import { isValidItem, getItemData, createItem } from "@shared/modules/items";
import { ServerCall } from "@shared/calls/server";
import { rpc } from "@/rpc";
import { needsToBeInGame } from "@/rpc/checks";
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

rpc.registerClient(ServerCall.FromClient.USE_ITEM, (player, slot) => {
  needsToBeInGame(player);

  const inventoryItem = player.store.character.inventory.items.find((item) => {
    return item.slot === slot;
  });

  if (!inventoryItem) {
    return false;
  }

  alt.emit(ServerEvents.FromServer.USE_ITEM, player, inventoryItem);

  return true;
});

rpc.registerClient(ServerCall.FromClient.EQUIP_ITEM, (player, slot) => {
  needsToBeInGame(player);

  const inventoryItem = player.getInventoryItemInSlot(slot);

  if (!inventoryItem) {
    return false;
  }

  return player.equipItem(inventoryItem);
});

rpc.registerClient(ServerCall.FromClient.UNEQUIP_ITEM, (player, equipmentSlot) => {
  needsToBeInGame(player);

  player.unequipItem(equipmentSlot);

  return true;
});

rpc.registerClient(ServerCall.FromClient.DROP_ITEM, (player, slot) => {
  needsToBeInGame(player);

  const index = player.store.character.inventory.items.findIndex((inventoryItem) => {
    return inventoryItem.slot === slot;
  });

  player.store.character.inventory.items.splice(index, 1);
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
