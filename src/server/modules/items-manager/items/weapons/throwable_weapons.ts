import * as alt from "@altv/server";
import { ServerEvents } from "@shared/events/server";
import { getWeaponHash } from "@shared/modules/items";
import { isItemThrowableWeapon } from "@shared/modules/items/registry/weapons/throwable-weapon.items";
import { isInGame } from "@/utility/assertions";
import { removeItemFromInventory } from "../../api";

alt.Events.on(ServerEvents.FromServer.EQUIP_ITEM, (player, item) => {
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

alt.Events.onProjectileStart(({ player, weaponHash }) => {
  if (!isInGame(player)) {
    return;
  }

  const equipedWeapon = player.character.equipment.weapon;

  if (!equipedWeapon) {
    return;
  }

  if (getWeaponHash(equipedWeapon.key) !== weaponHash) {
    return;
  }

  if (!isItemThrowableWeapon(equipedWeapon)) {
    return;
  }

  if (equipedWeapon.amount <= 0) {
    player.removeEquipedItem("weapon");
    return;
  }

  if ((equipedWeapon.amount -= 1) <= 0) {
    player.removeEquipedItem("weapon");
  }

  return;
});
