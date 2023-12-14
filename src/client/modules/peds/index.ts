import * as alt from "@altv/client";
import * as game from "@altv/natives";
import { PedFlags } from "@shared/modules/ped/constants";
import { waitUntil } from "@/core/utility/event-helpers";
import { setupPeacefulPed } from "./setup-ped/setup-peaceful-ped";
import { setupTerroristPed } from "./setup-ped/setup-terrorist-ped";

alt.Events.onGameEntityCreate(async ({ entity }) => {
  if (entity instanceof alt.Ped) {
    await waitUntil(() => entity.visible && game.isEntityVisibleToScript(entity));

    const flags = entity.streamSyncedMeta.flags as PedFlags;

    if (flags & PedFlags.Peaceful) {
      setupPeacefulPed(entity);
    } else {
      setupTerroristPed(entity);
    }
  }
});
