import alt from "alt-client";
import native from "natives";
import { weapons } from "@shared/modules/items";
import { Bones } from "@shared/enums/bones";
import { DamageMultiplier } from "@shared/modules/combat/damage-multipliers";
import { StreamedNpc } from "../ped";
import { MAX_PED_HEALTH } from "../constants";

export function applyWeaponDamage(streamedNpc: StreamedNpc): null | {
  damage: number;
  damageData: DamageData;
} {
  if (
    native.hasEntityBeenDamagedByEntity(
      streamedNpc.ped,
      alt.Player.local.scriptID,
      true
    )
  ) {
    const weapon = Object.values(weapons).find(({ hash }) =>
      native.hasPedBeenDamagedByWeapon(streamedNpc.ped, hash, 0)
    );

    if (!weapon) {
      return null;
    }

    const nativeDamage =
      streamedNpc.lastPedHealth - native.getEntityHealth(streamedNpc.ped);

    native.clearEntityLastDamageEntity(streamedNpc.ped);

    const bone = native.getPedLastDamageBone(streamedNpc.ped)[1];
    const damage =
      bone && weapon?.stats.damage
        ? weapon.stats.damage * DamageMultiplier[bone as Bones]
        : nativeDamage;

    native.applyDamageToPed(
      streamedNpc.ped,
      (damage / streamedNpc.npc.maxHealth) * MAX_PED_HEALTH -
        (weapon?.stats.damage || nativeDamage),
      true,
      0
    );

    return {
      damageData: {
        bone,
        weapon: weapon.key,
        nativeDamage,
      },
      damage,
    };
  }
  return null;
}
