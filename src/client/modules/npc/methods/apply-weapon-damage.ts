import alt from "alt-client";
import game from "natives";
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
    game.hasEntityBeenDamagedByEntity(
      streamedNpc.ped,
      alt.Player.local.scriptID,
      true
    )
  ) {
    const weapon = Object.values(weapons).find(({ hash }) =>
      game.hasPedBeenDamagedByWeapon(streamedNpc.ped, hash, 0)
    );

    if (!weapon) {
      return null;
    }

    const nativeDamage =
      streamedNpc.lastPedHealth - game.getEntityHealth(streamedNpc.ped);

    game.clearEntityLastDamageEntity(streamedNpc.ped);

    const bone = game.getPedLastDamageBone(streamedNpc.ped)[1];
    const damage =
      bone && weapon?.stats.damage
        ? weapon.stats.damage * DamageMultiplier[bone as Bones]
        : nativeDamage;

    game.applyDamageToPed(
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
