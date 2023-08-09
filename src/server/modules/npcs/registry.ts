import alt from "alt-server";
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

export function createNpc<
  T extends { key?: string; name?: string; flags?: NpcFlags }
>(type: PedType, model: number, pos: alt.Vector3, heading: number, data: T) {
  const npc = new alt.Ped(model, pos, new alt.Vector3(heading));

  alt.log(`Created NPC ${data.name} (${npc.id})`);

  if (type === PedType.STATIC) {
    npc.frozen = true;
    npc.collision = false;
  }

  for (let key in data) {
    if (typeof data[key] === undefined) {
      continue;
    }
    npc.setStreamSyncedMeta(key as string, data[key]);
  }

  if (data.key) {
    registerNpc(data.key, npc);
  }

  return npc;
}
