import alt from "@altv/server";
import { ClientEvents } from "@shared/events/client";
import { getBodyPartDamageMultiplier } from "@shared/modules/combat/damage-multipliers";
import {
  getItemInfoByKey,
  isItemFirearmWeapon,
  getAmmoDamageMultiplier,
  getWeaponAmmoEquipmentSlot,
  isWeaponWithClip,
  getWeaponDamageMultiplier,
} from "@shared/modules/items";
import { isInGame } from "@/core/utility/assertions";

alt.Events.onWeaponDamage(
  ({ source, target, damage, weaponHash, bodyPart, cancel, setDamageValue }) => {
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

    const ammo = isWeaponWithClip(equipedWeapon.key)
      ? equipedWeapon.clip
      : source.getEquipedItemInSlot(getWeaponAmmoEquipmentSlot(equipedWeapon.key));

    if (!ammo) {
      return cancel();
    }

    const initialDamage = damage;
    const weaponDamage = damage * getWeaponDamageMultiplier(equipedWeapon.key, equipedWeapon.grade);
    const ammoDamage = weaponDamage * getAmmoDamageMultiplier(ammo.key, ammo.grade) - weaponDamage;
    const bodyPartDamage = weaponDamage * getBodyPartDamageMultiplier(bodyPart) - weaponDamage;
    const totalDamage = weaponDamage + ammoDamage + bodyPartDamage;

    if (totalDamage > 0) {
      setDamageValue(totalDamage);

      if (target instanceof alt.Ped) {
        target.health = Math.max(
          99,
          Math.min(target.maxHealth, target.health - totalDamage + initialDamage),
        );
      }

      source.emit(
        ClientEvents.FromServer.DISPLAY_DAMAGE_HIT,
        target.type,
        target.id,
        weaponDamage + bodyPartDamage,
        "health",
      );

      source.emit(
        ClientEvents.FromServer.DISPLAY_DAMAGE_HIT,
        target.type,
        target.id,
        ammoDamage,
        "armor",
      );
    } else {
      cancel();
    }
  },
);
