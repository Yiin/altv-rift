import alt from "alt-server";
import { ItemType } from "@prisma/client";
import { ServerEvents } from "@shared/events/server";
import {
  createItem,
  getItemData,
  getItemInfoByKey,
  getWeaponAmmoGroup,
  getWeaponHash,
} from "@shared/modules/items";
import { AmmoItem, InventoryItem } from "@shared/interfaces";

alt.on(ServerEvents.FromServer.EQUIP_ITEM, (player, item) => {
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

  const weaponData = getItemData(equipedWeapon);

  const inventoryItem = player.store.character.inventory.items.find(
    (inventoryItem): inventoryItem is InventoryItem<AmmoItem> => {
      return inventoryItem.data === item;
    }
  );

  if (!inventoryItem) {
    return;
  }

  player.loadAmmoIntoWeapon(inventoryItem, equipedWeapon);

  player.setWeaponAmmo(getWeaponHash(equipedWeapon.key), weaponData.ammo?.data.amount ?? 0);
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

  const weaponHash = getWeaponHash(equipedWeapon.key);

  const ammo = weaponData.ammo;

  // Unequip ammo
  weaponData.ammo = null;

  // Add ammo to inventory
  player.addItem(createItem(ammo.key, ammo.data));

  // Set weapon ammo to 0
  player.setWeaponAmmo(weaponHash, 0);
});
