import alt from "@altv/client";
import { PedFlags } from "@shared/modules/ped/constants";
import { setupPeacefulPed } from "./setup-ped/setup-peaceful-ped";
import { setupEnemyPed } from "./setup-ped/setup-enemy-ped";

alt.Events.onGameEntityCreate(async ({ entity }) => {
  if (entity instanceof alt.Ped) {
    await alt.Utils.waitFor(() => entity.valid && entity.scriptID !== 0);

    const flags = entity.streamSyncedMeta.flags;

    if (typeof flags !== "undefined") {
      if (flags & PedFlags.Peaceful) {
        setupPeacefulPed(entity);
      } else {
        setupEnemyPed(entity);
      }
    }
  }
});
