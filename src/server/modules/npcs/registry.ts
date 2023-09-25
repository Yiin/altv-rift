import * as alt from "@altv/server";
import { NpcFlags, PedType } from "@shared/modules/npc/constants";

const npcs = new Map<string, alt.Ped>();

export function registerNpc(key: string, npc: alt.Ped) {
  if (npcs.has(key)) {
    throw new Error(`NPC with key "${key}" already registered`);
  }
  npcs.set(key, npc);
}

export function getNpc(key: string) {
  return npcs.get(key);
}

export function createNpc<T extends { key?: string; name?: string; flags?: NpcFlags }>(
  type: PedType,
  model: number,
  pos: alt.Vector3,
  heading: number,
  data: T
) {
  const npc = alt.Ped.create({ model, pos: new alt.Vector3(0, 0, 1).add(pos), heading });

  if (!npc) {
    throw new Error(`Failed to create NPC ${model}.`);
  }

  alt.log(`Created NPC ${data.name} (${npc.id})`);

  if (type === PedType.STATIC) {
    npc.frozen = true;
    npc.collision = false;
  }

  for (const key in data) {
    if (typeof data[key] === undefined) {
      continue;
    }
    alt.log(`${data.key}: Setting ${key} to ${data[key]}`);
    npc.streamSyncedMeta[key] = data[key];
  }

  if (data.key) {
    registerNpc(data.key, npc);
  }

  return npc;
}
