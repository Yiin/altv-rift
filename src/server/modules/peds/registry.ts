import * as alt from "@altv/server";
import { PedFlags } from "@shared/modules/ped/constants";

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
  pedKey: string,
  options: alt.PedCreateOptions,
  data: T
) {
  const ped = alt.Ped.create(options);

  ped.frozen = true;
  ped.collision = false;

  Object.assign(ped.streamSyncedMeta, data);

  registerPed(pedKey, ped);

  return ped;
}
