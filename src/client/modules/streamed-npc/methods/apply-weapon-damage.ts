import alt from "alt-client";
import game from "natives";
import { weapons } from "@shared/modules/items";
import { Bones } from "@shared/enums/bones";
import { DamageMultiplier } from "@shared/modules/combat/damage-multipliers";
import { StreamedNpc } from "../ped";
import { MAX_PED_HEALTH } from "../constants";

declare module "../ped" {
  interface StreamedNpc {
    applyWeaponDamage: typeof applyWeaponDamage;
  }
}

function applyWeaponDamage(this: StreamedNpc): null | {
  damage: number;
  damageData: DamageData;
} {
  if (
    game.hasEntityBeenDamagedByEntity(this.ped, alt.Player.local.scriptID, true)
  ) {
    const weapon = Object.values(weapons).find(({ hash }) =>
      game.hasPedBeenDamagedByWeapon(this.ped, hash, 0)
    );

    if (!weapon) {
      return null;
    }

    const nativeDamage = this.lastPedHealth - game.getEntityHealth(this.ped);

    game.clearEntityLastDamageEntity(this.ped);

    const bone = game.getPedLastDamageBone(this.ped)[1];
    const damage =
      bone && weapon?.stats.damage
        ? weapon.stats.damage * DamageMultiplier[bone as Bones]
        : nativeDamage;

    game.applyDamageToPed(
      this.ped,
      (damage / this.npc.maxHealth) * MAX_PED_HEALTH -
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

StreamedNpc.prototype.applyWeaponDamage = applyWeaponDamage;
