import alt from "@altv/server";
import { PedFlags } from "@shared/modules/ped";
import { PedKey } from "@shared/modules/ped/list";
import { registerPed } from "../peds.registry";

export function createStaticPed({
  key,
  flags,
  name,
  meta,
  ...pedCreateOptions
}: {
  key?: PedKey;
  flags?: PedFlags;
  name?: string;
  meta?: Record<string, any>;
} & alt.PedCreateOptions): alt.Ped {
  const ped = alt.Ped.create(pedCreateOptions);

  ped.frozen = true;
  ped.collision = false;
  ped.streamSyncedMeta.flags = flags ? flags | PedFlags.Peaceful : PedFlags.Peaceful;

  ped.streamSyncedMeta.key = key;
  Object.assign(ped.streamSyncedMeta, { ...meta, key, flags, name });

  if (key) {
    registerPed(key, ped);
  }

  return ped;
}
