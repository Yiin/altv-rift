import alt from "alt-client";
import game from "natives";
import { RAGDOLL_BLOCKING_FLAGS } from "@shared/enums/ragdoll-blocking-flags";
import { everyTickWhile } from "@/utility/event-helpers";
import { PED_RESET_FLAG } from "../constants/ped-flags";

export function setupPeacefulPed(ped: alt.Ped) {
  const scriptID = ped.scriptID;

  game.taskSetBlockingOfNonTemporaryEvents(scriptID, true);
  game.setEntityProofs(
    scriptID,
    true,
    true,
    true,
    true,
    true,
    true,
    true, // DontResetDamageFlagsOnCleanupMissionState
    true
  );

  game.setRagdollBlockingFlags(scriptID, RAGDOLL_BLOCKING_FLAGS.RBF_ALL);

  everyTickWhile(
    () => ped.valid,
    () => {
      if (game.isPlayerFreeAimingAtEntity(game.playerId(), scriptID)) {
        game.disablePlayerFiring(game.playerId(), true);
        game.disableAimCamThisUpdate();
      }
      // Keep them clean
      game.clearPedBloodDamage(scriptID);
      game.setPedTreatedAsFriendly(scriptID, 1, 0);

      game.setPedResetFlag(
        scriptID,
        PED_RESET_FLAG.BlockFallTaskFromExplosionDamage,
        true
      );
      game.setPedResetFlag(
        scriptID,
        PED_RESET_FLAG.BlockWeaponReactionsUnlessDead,
        true
      );
      game.setPedResetFlag(
        scriptID,
        PED_RESET_FLAG.DisablePotentialBlastReactions,
        true
      );
    }
  );
}
