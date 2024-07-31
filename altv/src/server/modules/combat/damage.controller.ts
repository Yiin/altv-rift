import alt from "@altv/server";
import { ClientEvents } from "@shared/events/client";
import { getBodyPartDamageMultiplier } from "@shared/modules/combat/damage-multipliers";
import {
  getItemInfoByKey,
  isItemFirearmWeapon,
  getAmmoDamageMultiplier,
  getWeaponAmmoEquipmentSlot,
  isWeaponWithClip,
  getWeaponDamage,
  isItemWeapon,
} from "@shared/modules/items";
import { PED_HEALTH_ZERO, PED_HEALTH_ZERO_DEFAULT } from "@shared/modules/ped";
import { isInGame } from "@/core/utility/assertions";

alt.Events.onWeaponDamage(
  ({ source, target, damage, weaponHash, bodyPart, cancel, setDamageValue }) => {
    if (
      source.type === alt.Enums.BaseObjectType.PED &&
      target.type === alt.Enums.BaseObjectType.PED
    ) {
      // ignore friendly fire between enemy peds
      alt.log("ignore friendly fire between enemy peds");
      return cancel();
    }

    if (source.type !== alt.Enums.BaseObjectType.PLAYER) {
      return;
    }

    if (!isInGame(source)) {
      return cancel();
    }

    const equipedWeapon = source.character.equipment.weapon;

    if (equipedWeapon && isItemWeapon(equipedWeapon) && getItemInfoByKey(equipedWeapon.key).hash !== weaponHash) {
      return cancel();
    }

    const ammo = equipedWeapon && isItemFirearmWeapon(equipedWeapon)
      ? isWeaponWithClip(equipedWeapon.key)
        ? equipedWeapon.clip
        : source.getEquipedItemInSlot(getWeaponAmmoEquipmentSlot(equipedWeapon.key))
      : false;

    if (!ammo && ammo !== false) {
      return cancel();
    }

    const weaponDamage = equipedWeapon && isItemWeapon(equipedWeapon) ? getWeaponDamage(equipedWeapon.key, equipedWeapon.grade) : damage;
    const ammoDamage = ammo ? weaponDamage * getAmmoDamageMultiplier(ammo.key, ammo.grade) - weaponDamage : 0;
    const bodyPartDamage = weaponDamage * getBodyPartDamageMultiplier(bodyPart) - weaponDamage;

    const totalDamage = weaponDamage + ammoDamage + bodyPartDamage;

    if (totalDamage <= 0) {
      return cancel();
    }

    if (target instanceof alt.Ped) {
      const newHealth = Math.max(
        PED_HEALTH_ZERO,
        Math.min(target.streamSyncedMeta.maxHealth, target.streamSyncedMeta.health - totalDamage),
      );

      target.health = newHealth + PED_HEALTH_ZERO_DEFAULT;
      target.streamSyncedMeta.health = newHealth;
    } else {
      setDamageValue(totalDamage);
    }

    if (weaponDamage + bodyPartDamage > 0) {
      source.emit(
        ClientEvents.FromServer.DISPLAY_DAMAGE_HIT,
        target.type,
        target.id,
        weaponDamage + bodyPartDamage,
        "health",
      );
    }

    if (ammoDamage > 0) {
      source.emit(
        ClientEvents.FromServer.DISPLAY_DAMAGE_HIT,
        target.type,
        target.id,
        ammoDamage,
        "armor",
      );
    }
  },
);
