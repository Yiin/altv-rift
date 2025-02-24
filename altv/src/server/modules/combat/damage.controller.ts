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
import { SpecialDamageType } from "@shared/enums/special-damage-type";

alt.Events.onPedDamage(({ attacker, ped, weapon, healthDamage, armourDamage }) => {
  if (attacker instanceof alt.Player === false || !isInGame(attacker)) {
    return;
  }

  const equipedWeapon = attacker.character.equipment.weapon;

  if (equipedWeapon && !isItemFirearmWeapon(equipedWeapon)) {
    return;
  }

  if (Object.values(SpecialDamageType).includes(weapon)) {
    /**
     * Currently there is no way to control explosion damage, so we just use default one,
     * default being instakill for the ped.
     * Not sure if we even have a workaround for that, because if we set ped hp to 10k, explosion damage will be 10k as well,
     * and because that damage is applied instantly to ped on client side, server can't heal ped in time.
     * We also can't make ped explosion-proof, because then client won't even report the damage, as no damage is done.
     * There are natives to control player explosive damage, but I don't think it applies to peds.
     */
    const weaponDamage =
      healthDamage + armourDamage - PED_HEALTH_ZERO_DEFAULT ||
      (equipedWeapon ? getWeaponDamage(equipedWeapon.key, equipedWeapon.grade) : 100);

    const totalDamage = weaponDamage; // weaponDamage * (Math.random() + 0.5);

    const newHealth = Math.max(
      PED_HEALTH_ZERO,
      Math.min(ped.streamSyncedMeta.maxHealth, ped.streamSyncedMeta.health - totalDamage),
    );

    ped.health = newHealth + PED_HEALTH_ZERO_DEFAULT;
    ped.streamSyncedMeta.health = newHealth;

    if (totalDamage > 0) {
      attacker.emit(
        ClientEvents.FromServer.DISPLAY_DAMAGE_HIT,
        ped.type,
        ped.id,
        totalDamage,
        "explosion",
      );
    }
  }
});

alt.Events.onWeaponDamage(
  ({ source, target, damage, weaponHash, bodyPart, cancel, setDamageValue }) => {
    alt.log(`onWeaponDamage`, {
      source: source.id,
      target: target.id,
      damage,
      weaponHash,
      bodyPart,
    });

    if (target.type === alt.Enums.BaseObjectType.PED) {
      cancel();
    }

    if (
      source.type === alt.Enums.BaseObjectType.PED &&
      target.type === alt.Enums.BaseObjectType.PED
    ) {
      // ignore friendly fire between enemy peds
      alt.log("ignore friendly fire between enemy peds");
      return;
    }

    if (source === target) {
      // if ped attacks player, it gets repported as if player attacked himself with ped weapon
      return;
    }

    if (source.type !== alt.Enums.BaseObjectType.PLAYER) {
      alt.log("ignore non-player source");
      return;
    }

    if (!isInGame(source)) {
      alt.log("ignore non-in-game source");
      return;
    }

    const equipedWeapon = source.character.equipment.weapon;

    if (
      equipedWeapon &&
      isItemWeapon(equipedWeapon) &&
      getItemInfoByKey(equipedWeapon.key).hash !== weaponHash
    ) {
      alt.log(
        `ignore wrong weapon: equiped: ${equipedWeapon.key}, current: ${weaponHash}, ${getItemInfoByKey(equipedWeapon.key).hash} !== ${weaponHash}`,
      );
      alt.log(
        `source: ${source.constructor.name} ${source.id}, target: ${target.constructor.name} ${target.id}, damage: ${damage}`,
      );
      return;
    }

    const ammo =
      equipedWeapon && isItemFirearmWeapon(equipedWeapon)
        ? isWeaponWithClip(equipedWeapon.key)
          ? equipedWeapon.clip
          : source.getEquipedItemInSlot(getWeaponAmmoEquipmentSlot(equipedWeapon.key))
        : false;

    if (!ammo && ammo !== false) {
      alt.log("ignore wrong ammo");
      return cancel();
    }

    const weaponDamage =
      equipedWeapon && isItemWeapon(equipedWeapon)
        ? getWeaponDamage(equipedWeapon.key, equipedWeapon.grade)
        : damage;
    const ammoDamage = ammo
      ? weaponDamage * getAmmoDamageMultiplier(ammo.key, ammo.grade) - weaponDamage
      : 0;
    const bodyPartDamage = weaponDamage * getBodyPartDamageMultiplier(bodyPart) - weaponDamage;

    const totalDamage = weaponDamage + ammoDamage + bodyPartDamage;

    if (totalDamage <= 0) {
      alt.log("ignore negative damage");
      return cancel();
    }

    if (target instanceof alt.Ped) {
      const newHealth = Math.max(
        PED_HEALTH_ZERO,
        Math.min(target.streamSyncedMeta.maxHealth, target.streamSyncedMeta.health - totalDamage),
      );

      if (Number.isNaN(newHealth)) {
        // we don't control this ped, ignore custom damage
        alt.log("ignore custom damage");
        return;
      }

      target.health = newHealth + PED_HEALTH_ZERO_DEFAULT;
      target.streamSyncedMeta.health = newHealth;
    } else {
      // For non-ped targets (players, vehicles), we use built-in health, so just change the damage value
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
