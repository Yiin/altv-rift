import alt from "alt-server";
import { ItemType } from "@prisma/client";
import { toRaw } from "vue";
import { ServerEvents } from "@shared/events/server";
import {
  createItem,
  getItemData,
  getItemInfoByKey,
  getWeaponAmmoGroup,
  getWeaponHash,
} from "@shared/modules/items";
import { AmmoItem, InventoryItem } from "@shared/interfaces";
import { isInGame } from "@/utility/assertions";

alt.on(ServerEvents.FromServer.EQUIP_ITEM, (player, item, inventorySlot) => {
  if (item.type !== ItemType.AMMO) {
    return;
  }

  const equipedWeapon = player.store.character.equipment.weapon;

  if (!equipedWeapon) {
    return;
  }

  if (equipedWeapon.type !== ItemType.FIREARM_WEAPON) {
    return;
  }

  if (getWeaponAmmoGroup(equipedWeapon.key) !== getItemInfoByKey(item.key).group) {
    return;
  }

  if (typeof inventorySlot === "undefined") {
    return;
  }

  const inventoryItem = player.store.character.inventory.items.find(
    (inventoryItem): inventoryItem is InventoryItem<AmmoItem> => {
      return inventoryItem.slot === inventorySlot;
    }
  );

  if (!inventoryItem) {
    return;
  }

  player.loadAmmoIntoWeapon(inventoryItem, equipedWeapon);
});

alt.on(ServerEvents.FromServer.UNEQUIP_ITEM, (player, equipmentSlot) => {
  if (equipmentSlot !== "ammo") {
    return;
  }

  const equipedWeapon = player.store.character.equipment.weapon;

  if (!equipedWeapon) {
    return;
  }

  if (equipedWeapon.type !== ItemType.FIREARM_WEAPON) {
    return;
  }

  const weaponData = getItemData(equipedWeapon);

  if (!weaponData.ammo) {
    return;
  }

  const ammo = weaponData.ammo;

  // Unequip ammo
  weaponData.ammo = null;

  // Add ammo to inventory
  player.addItem(createItem(ammo.key, ammo.clip));
  player.addItem(createItem(ammo.key, ammo.rest));
});
