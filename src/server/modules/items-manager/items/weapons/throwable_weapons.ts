import alt from "alt-server";
import { ServerEvents } from "@shared/events/server";
import { getItemData, getWeaponHash } from "@shared/modules/items";
import { isItemThrowableWeapon } from "@shared/modules/items/weapons/throwable";
import { isInGame } from "@/utility/assertions";
import { removeItemFromInventory } from "../../api";

alt.on(ServerEvents.FromServer.EQUIP_ITEM, (player, item) => {
  if (!isItemThrowableWeapon(item)) {
    return;
  }

  const itemData = getItemData(item);

  if (itemData.amount <= 0) {
    removeItemFromInventory(player.character.inventory, item);
    return;
  }

  if (player.currentWeapon === getWeaponHash(item.key)) {
    return;
  }

  player.giveWeapon(getWeaponHash(item.key), itemData.amount, true);
});

alt.on("startProjectile", (player, pos, dir, ammoHash, weaponHash) => {
  if (!isInGame(player)) {
    return false;
  }

  const equipedWeapon = player.character.equipment.weapon;

  if (!equipedWeapon) {
    return false;
  }

  if (getWeaponHash(equipedWeapon.key) !== weaponHash) {
    return false;
  }

  if (!isItemThrowableWeapon(equipedWeapon)) {
    return;
  }

  const weaponData = getItemData(equipedWeapon);

  if (weaponData.amount <= 0) {
    player.removeEquipedItem("weapon");
    return false;
  }

  if ((weaponData.amount -= 1) <= 0) {
    player.removeEquipedItem("weapon");
  }

  return true;
});
