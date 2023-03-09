import alt, { Player } from "alt-server";
import { ItemType } from "@prisma/client";
import { sample } from "lodash-es";
import { RPC } from "@shared/constants/rpcs";
import {
  findItemByKey,
  getItemType,
  getWeaponHash,
  isValidItem,
  ItemKey,
  ITEMS_REGISTRY,
  WeaponItemInfo,
  WeaponItemKey,
  weapons,
} from "@shared/data/items";
import { AmmoItemData, InventoryItem } from "@shared/interfaces";
import { getItemData } from "@shared/utility/inventory";
import { Events } from "@shared/constants/events";
import { rpc } from "@/rpc";
import { registerCmd } from "../chat";

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

alt.onClient(Events.Server.REQUEST_ITEM, (player) => {
  alt.log("Adding item");
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

rpc.registerClient(RPC.Server.EQUIP_ITEM, (player: Player, index: number) => {
  if (!player.store.isLoggedIn) return;

  const inventoryItem = player.store.character.inventory.items.find(
    ({ slot }) => {
      return slot === index;
    }
  );

  if (!inventoryItem) return;

  switch (inventoryItem.data.type) {
    case ItemType.WEAPON:
      const baseAmmo = findAmmo(player, findItemByKey(inventoryItem.data.key));
      const ammo =
        getItemData(inventoryItem.data)?.ammo ?? toEquipedAmmo(baseAmmo);

      const itemKey = inventoryItem.data.key as WeaponItemKey;
      const weaponHash = getWeaponHash(itemKey);

      if (!ammo) {
        console.log('No ammo for weapon "' + itemKey + '"');
        player.giveWeapon(weaponHash, -1, true);
        return;
      }

      console.log(
        'Equiping weapon "' + itemKey + '" with ammo "' + ammo.key + '"'
      );
      player.giveWeapon(weaponHash, ammo.data.amount, true);
      break;
  }
});

rpc.registerClient(RPC.Server.DROP_ITEM, (player: Player, index: number) => {
  if (!player.store.isLoggedIn) return;

  console.log("DROP_ITEM", index);
  player.store.character.inventory.items.splice(index, 1);
  return true;
});

rpc.registerClient(
  RPC.Server.MOVE_ITEM,
  (player: Player, from: number, to: number) => {
    if (!player.store.isLoggedIn) return;

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
  }
);
