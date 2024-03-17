import alt from "@altv/server";
import { PedFlags } from "@shared/modules/ped/constants";
import { PedKey } from "@shared/modules/ped/list";

const pedsMap = new Map<string, alt.Ped>();

alt.Events.onResourceStop(() => {
  for (const ped of pedsMap.values()) {
    ped.destroy();
  }
});

export function registerPed(key: string, ped: alt.Ped) {
  if (pedsMap.has(key)) {
    throw new Error(`Ped with key "${key}" is already registered`);
  }
  pedsMap.set(key, ped);
}

export function getPedByKey(key: string) {
  return pedsMap.get(key);
}

export function createStaticPed<T extends { name?: string; flags?: PedFlags }>(
  pedKey: PedKey,
  options: alt.PedCreateOptions,
  data: T,
) {
  const ped = alt.Ped.create(options);

  ped.frozen = true;
  ped.collision = false;

  ped.streamSyncedMeta.key = pedKey;
  Object.assign(ped.streamSyncedMeta, data);

  registerPed(pedKey, ped);

  return ped;
}

export function createTerroristPed(
  options: alt.PedCreateOptions,
  data: { name?: string; flags?: PedFlags; weapon: number; health?: number },
) {
  const ped = alt.Ped.create(options);

  const { health, ...meta } = data;

  Object.assign(ped.streamSyncedMeta, meta);

  ped.maxHealth = health ?? 100;
  ped.health = ped.maxHealth;

  return ped;
}
