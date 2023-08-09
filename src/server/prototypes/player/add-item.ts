import { Player } from "alt-server";
import {
  AmmoItemData,
  ClothingItemData,
  ConsumableItemData,
  Inventory,
  InventoryItem,
  ItemTypeByKey,
  ItemTypeData,
  WeaponItemData,
} from "@shared/interfaces";
import { ItemKey, getItemType, getItemData } from "@shared/modules/items";
import { ItemType } from "@shared/modules/items/item-type";

declare module "alt-server" {
  export interface Player {
    addItem<T extends ItemKey>(
      key: T,
      data: ItemTypeData[ItemTypeByKey<typeof key>]
    ): InventoryItem | undefined;
  }
}

Player.prototype.addItem = function (key, data) {
  if (!this.store.isLoggedIn) return;

  const type = getItemType(key);

  const item = this.store.character?.inventory.items.find((item) => {
    return item.data.key === key;
  });

  if (item) {
    const itemData = getItemData(item.data);

    if (itemData && "amount" in itemData && "amount" in data) {
      itemData.amount += data.amount;
      return;
    }
  }

  const freeSlot = findFreeSlot(this.store.character.inventory);

  if (freeSlot === -1) return;

  const inventoryItem = {
    slot: freeSlot,
    data: {
      // because typescript
      [ItemType.WEAPON]: {
        key,
        type,
        WEAPON: data,
      } as WeaponItemData,
      [ItemType.AMMO]: {
        key,
        type,
        AMMO: data,
      } as AmmoItemData,
      [ItemType.CLOTHING]: {
        key,
        type,
        CLOTHING: data,
      } as ClothingItemData,
      [ItemType.CONSUMABLE]: {
        key,
        type,
        CONSUMABLE: data,
      } as ConsumableItemData,
    }[type],
  };

  this.store.character.inventory.items.push(inventoryItem);

  return inventoryItem;
};

function findFreeSlot(inventory: Inventory) {
  for (let i = 0; i < inventory.size; i++) {
    if (!inventory.items.some((item) => item.slot === i)) {
      return i;
    }
  }
  return -1;
}
