import alt from "alt-client";
import { NpcFlags } from "@shared/modules/npc/constants";
import { waitUntil } from "@/utility/event-helpers";
import { setupPeacefulPed } from "./setup-ped/setup-peaceful-ped";

alt.on("gameEntityCreate", async (entity) => {
  if (entity instanceof alt.Ped) {
    await waitUntil(() => entity.visible);

    const ped = entity.scriptID;

    alt.log(`Ped created: ${entity.id}, scriptID: ${ped}`);

    const flags = entity.getStreamSyncedMeta("Flags") as NpcFlags;

    if (flags & NpcFlags.Peaceful) {
      setupPeacefulPed(entity);
    }
  }
});
