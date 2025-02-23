import alt from "@altv/server";
import { PedFlags, PED_HEALTH_ZERO_DEFAULT } from "@shared/modules/ped";

export function createEnemyPed(
  options: alt.PedCreateOptions,
  data: { name?: string; flags?: PedFlags; weapon: number; health?: number },
): alt.Ped {
  const ped = alt.Ped.create(options);

  const { health, ...meta } = data;

  meta.flags = meta.flags ? meta.flags | PedFlags.Enemy : PedFlags.Enemy;
  Object.assign(ped.streamSyncedMeta, meta);

  ped.health = ped.maxHealth = PED_HEALTH_ZERO_DEFAULT + (health ?? 100);
  ped.streamSyncedMeta.health = ped.streamSyncedMeta.maxHealth = health ?? 100;

  return ped;
}
