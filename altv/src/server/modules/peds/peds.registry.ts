import alt from "@altv/server";

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
