import alt from "@altv/client";
import game from "@altv/natives";
import { NpcFlags } from "@shared/modules/npc/constants";
import { waitUntil } from "@/core/utility/event-helpers";
import { setupPeacefulPed } from "./setup-ped/setup-peaceful-ped";

alt.Events.onGameEntityCreate(async ({ entity }) => {
  if (entity instanceof alt.Ped) {
    await waitUntil(() => entity.visible);
    await waitUntil(() => game.isEntityVisibleToScript(entity));

    const flags = entity.streamSyncedMeta.flags as NpcFlags;

    if (flags & NpcFlags.Peaceful) {
      setupPeacefulPed(entity);
    }
  }
});
