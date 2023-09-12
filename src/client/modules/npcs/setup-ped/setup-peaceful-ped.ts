import game from "@altv/natives";
import * as alt from "@altv/client";
import { RAGDOLL_BLOCKING_FLAGS } from "@shared/enums/ragdoll-blocking-flags";
import { everyTickWhile } from "@/core/utility/event-helpers";
import { PED_RESET_FLAG } from "@/core/constants/ped-flags";

export function setupPeacefulPed(ped: alt.Ped) {
  game.taskSetBlockingOfNonTemporaryEvents(ped.scriptID, true);
  game.setEntityProofs(
    ped.scriptID,
    true,
    true,
    true,
    true,
    true,
    true,
    true, // DontResetDamageFlagsOnCleanupMissionState
    true
  );
  game.setPedTreatedAsFriendly(ped.scriptID, 1, 0);

  game.setRagdollBlockingFlags(ped.scriptID, RAGDOLL_BLOCKING_FLAGS.RBF_ALL);

  everyTickWhile(
    () => ped.valid,
    () => {
      game.setPedResetFlag(
        alt.Player.local.scriptID,
        PED_RESET_FLAG.PreventLockonToFriendlyPlayers,
        true
      );
      game.setPedResetFlag(ped.scriptID, PED_RESET_FLAG.PreventLockonToFriendlyPlayers, true);
      game.setPedResetFlag(ped.scriptID, PED_RESET_FLAG.BlockFallTaskFromExplosionDamage, true);
      game.setPedResetFlag(ped.scriptID, PED_RESET_FLAG.BlockWeaponReactionsUnlessDead, true);
      game.setPedResetFlag(ped.scriptID, PED_RESET_FLAG.DisablePotentialBlastReactions, true);
    }
  );
}
