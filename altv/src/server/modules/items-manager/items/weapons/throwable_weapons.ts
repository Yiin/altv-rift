import alt from "@altv/server";
import { ServerEvents } from "@shared/events/server";
import { getWeaponHash } from "@shared/modules/items";
import { isItemThrowableWeapon } from "@shared/modules/items/registry/weapons/throwable-weapon.items";
import { EquipmentSlot } from "@shared/interfaces";
import { isInGame } from "@/core/utility/assertions";
import { on } from "@/core/events/emit";
import { removeItemFromInventory } from "../../../../../shared/modules/inventory/api";

on(ServerEvents.FromServer.ITEM_EQUIP, (player, item) => {
  if (!isItemThrowableWeapon(item)) {
    return;
  }

  if (item.amount <= 0) {
    removeItemFromInventory(player.character.inventory, item);
    return;
  }

  if (player.currentWeapon === getWeaponHash(item.key)) {
    return;
  }

  player.giveWeapon(getWeaponHash(item.key), item.amount, true);
});

alt.Events.onProjectileStart(({ player, weaponHash, cancel }) => {
  if (!isInGame(player)) {
    cancel();
    return;
  }

  const equipedWeapon = player.character.equipment.weapon;

  if (!equipedWeapon) {
    cancel();
    return;
  }

  if (getWeaponHash(equipedWeapon.key) !== weaponHash) {
    cancel();
    return;
  }

  if (!isItemThrowableWeapon(equipedWeapon)) {
    cancel();
    return;
  }

  if (equipedWeapon.amount <= 0) {
    player.removeEquipedItem(EquipmentSlot.Weapon);
    cancel();
    return;
  }

  if ((equipedWeapon.amount -= 1) <= 0) {
    player.removeEquipedItem(EquipmentSlot.Weapon);
  }
});
