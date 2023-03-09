import alt from "alt-client";
import native from "natives";
import { DamageMultiplier } from "@shared/data/damage-multipliers";
import { weapons } from "@shared/data/items";
import { Bones } from "@shared/enums/bones";
import { StreamedNpc } from "../ped";
import { MAX_PED_HEALTH } from "../constants";

export function applyWeaponDamage(streamedNpc: StreamedNpc) {
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
      alt.log("No weapon found");
      return { damage: 0 };
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
      (damage / streamedNpc.npc.totalHealth) * MAX_PED_HEALTH -
        (weapon?.stats.damage || nativeDamage),
      true,
      0
    );
    return {
      damageData: {
        bone,
        weapon,
        nativeDamage,
      },
      damage,
    };
  }
  return { damage: 0 };
}
