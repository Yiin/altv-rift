import alt from "@altv/server";
import { ClientEvents } from "@shared/events/client";
import { getBodyPartDamageMultiplier } from "@shared/modules/combat/damage-multipliers";
import { getItemInfoByKey, isItemFirearmWeapon, getAmmoDamageMultiplier, getWeaponAmmoEquipmentSlot, isWeaponWithClip } from "@shared/modules/items";
import { isInGame } from "@/core/utility/assertions";

alt.Events.onWeaponDamage(({ source, target, damage, weaponHash, bodyPart, cancel, setDamageValue }) => {
  if (!isInGame(source)) {
    return cancel();
  }

  const equipedWeapon = source.character.equipment.weapon;

  if (!equipedWeapon) {
    return cancel();
  }

  const weaponInfo = getItemInfoByKey(equipedWeapon.key);

  if (weaponInfo.hash !== weaponHash) {
    return cancel();
  }

  if (!isItemFirearmWeapon(equipedWeapon)) {
    return cancel();
  }

  let ammoKey = isWeaponWithClip(equipedWeapon.key)
    ? equipedWeapon.clip?.key
    : source.getEquipedItemInSlot(getWeaponAmmoEquipmentSlot(equipedWeapon.key))?.key;

  if (!ammoKey) {
    return cancel();
  }

  const initialDamage = damage;
  damage *= getAmmoDamageMultiplier(ammoKey);
  damage *= getBodyPartDamageMultiplier(bodyPart);

  if (damage > 0) {
    setDamageValue(damage);

    if (target instanceof alt.Ped) {
      target.health -= Math.min(target.health, (damage - initialDamage)) + 1000;
    }

    source.emit(
      ClientEvents.FromServer.DISPLAY_DAMAGE_HIT,
      target.type,
      target.id,
      damage,
      "health"
    );
  } else {
    cancel();
  }
});
