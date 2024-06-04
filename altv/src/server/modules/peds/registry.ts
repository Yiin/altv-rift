import alt from "@altv/server";
import { PED_HEALTH_ZERO, PED_HEALTH_ZERO_DEFAULT, PedFlags } from "@shared/modules/ped/constants";
import { PedKey } from "@shared/modules/ped/list";

const pedsMap = new Map<string, alt.Ped>();

alt.Events.onResourceStop(() => {
  for (const ped of pedsMap.values()) {
    ped.destroy();
  }
});

export function registerPed(key: string, ped: alt.Ped): void {
  if (pedsMap.has(key)) {
    throw new Error(`Ped with key "${key}" is already registered`);
  }
  pedsMap.set(key, ped);
}

export function getPedByKey(key: string): alt.Ped | undefined {
  return pedsMap.get(key);
}

export function createStaticPed({
  key,
  flags,
  name,
  ...pedCreateOptions
}: {
  key?: PedKey;
  flags?: PedFlags;
  name?: string;
} & alt.PedCreateOptions): alt.Ped {
  const ped = alt.Ped.create(pedCreateOptions);

  ped.frozen = true;
  ped.collision = false;

  ped.streamSyncedMeta.key = key;
  Object.assign(ped.streamSyncedMeta, { key, flags, name });

  if (key) {
    registerPed(key, ped);
  }

  return ped;
}

export function createTerroristPed(
  options: alt.PedCreateOptions,
  data: { name?: string; flags?: PedFlags; weapon: number; health?: number },
): alt.Ped {
  const ped = alt.Ped.create(options);

  const { health, ...meta } = data;

  Object.assign(ped.streamSyncedMeta, meta);

  ped.health = ped.maxHealth = PED_HEALTH_ZERO_DEFAULT + (health ?? 100);
  ped.streamSyncedMeta.health = ped.streamSyncedMeta.maxHealth = health ?? 100;

  return ped;
}
