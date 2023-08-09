import alt, { Player } from "alt-server";
import { sample } from "lodash-es";
import { ItemType } from "@prisma/client";
import { AmmoItemData, InventoryItem } from "@shared/interfaces";
import { ServerEvents } from "@shared/events/server";
import {
  findItemByKey,
  getItemType,
  getWeaponHash,
  isValidItem,
  ITEMS_REGISTRY,
  WeaponItemInfo,
  WeaponItemKey,
  weapons,
  getItemData,
} from "@shared/modules/items";
import { ServerCall } from "@shared/calls/server";
import { rpc } from "@/rpc";
import { registerCmd } from "../chat";
import "./items";

registerCmd("giveitem", (player, [key, amount]) => {
  if (!isValidItem(key)) {
    return;
  }

  const type = getItemType(key);

  switch (type) {
    case ItemType.WEAPON:
      player.addItem(key, {
        durability: 100,
      });
      break;
    case ItemType.AMMO:
      player.addItem(key, {
        amount: +amount ?? 100,
      });
  }
});

alt.onClient(ServerEvents.FromClient.REQUEST_ITEM, (player) => {
  player.addItem(sample(weapons)!.key, {
    durability: 100,
    components: [],
    tints: [],
  });
});

export function findAmmo(player: Player, weapon: WeaponItemInfo) {
  if (!player.store.isLoggedIn) return;

  const ammo = player.store.character.inventory.items.find(
    (inventoryItem): inventoryItem is InventoryItem<AmmoItemData> => {
      const data = inventoryItem.data;
      if (data.type === ItemType.AMMO) {
        const item = ITEMS_REGISTRY[data.key];
      }
      return (
        data.type === ItemType.AMMO &&
        findItemByKey(data.key).group === weapon.group
      );
    }
  );

  return ammo?.data;
}

export function toEquipedAmmo(ammo?: AmmoItemData) {
  return ammo
    ? {
        key: ammo.key,
        data: {
          amount: getItemData(ammo)!.amount,
        },
      }
    : null;
}

rpc.registerClient(ServerCall.FromClient.USE_ITEM, (player, slot) => {
  if (!player.store.isLoggedIn) {
    return false;
  }

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
  if (!player.store.isLoggedIn) {
    return false;
  }

  const inventoryItem = player.store.character.inventory.items.find((item) => {
    return item.slot === slot;
  });

  if (!inventoryItem) {
    return false;
  }

  switch (inventoryItem.data.type) {
    case ItemType.WEAPON:
      const baseAmmo = findAmmo(player, findItemByKey(inventoryItem.data.key));
      const ammo =
        getItemData(inventoryItem.data)?.ammo ?? toEquipedAmmo(baseAmmo);

      const itemKey = inventoryItem.data.key as WeaponItemKey;
      const weaponHash = getWeaponHash(itemKey);

      if (!ammo) {
        console.log(
          'No ammo for weapon "' + itemKey + '". Equiping with 1000 ammo.'
        );
        player.giveWeapon(weaponHash, 1000, true);
        return true;
      }

      console.log(
        'Equiping weapon "' + itemKey + '" with ammo "' + ammo.key + '"'
      );
      player.giveWeapon(weaponHash, ammo.data.amount, true);
      break;
  }

  alt.emit(ServerEvents.FromServer.EQUIP_ITEM, player, inventoryItem);

  return true;
});

rpc.registerClient(ServerCall.FromClient.DROP_ITEM, (player, slot) => {
  if (!player.store.isLoggedIn) {
    return false;
  }
  const index = player.store.character.inventory.items.findIndex(
    (inventoryItem) => {
      return inventoryItem.slot === slot;
    }
  );

  player.store.character.inventory.items.splice(index, 1);
  return true;
});

rpc.registerWebview(ServerCall.FromWebview.MOVE_ITEM, (player, from, to) => {
  if (!player.store.isLoggedIn) {
    return false;
  }

  const itemInSlotFrom = player.store.character.inventory.items.find(
    ({ slot }) => {
      return slot === from;
    }
  );
  const itemInSlotTo = player.store.character.inventory.items.find(
    ({ slot }) => {
      return slot === to;
    }
  );
  if (itemInSlotFrom && itemInSlotTo) {
    [itemInSlotFrom.slot, itemInSlotTo.slot] = [
      itemInSlotTo.slot,
      itemInSlotFrom.slot,
    ];
  } else if (itemInSlotFrom) {
    itemInSlotFrom.slot = to;
  } else if (itemInSlotTo) {
    itemInSlotTo.slot = from;
  }
  return true;
});
