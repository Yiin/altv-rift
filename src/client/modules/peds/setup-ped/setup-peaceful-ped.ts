import alt from "@altv/client";
import game from "@altv/natives";
import { RAGDOLL_BLOCKING_FLAGS } from "@shared/enums/ragdoll-blocking-flags";
import { everyTickWhile } from "@/core/utility/event-helpers";
import { PED_CONFIG_FLAG, PED_RESET_FLAG } from "@/core/constants/ped-flags";

export function setupPeacefulPed(ped: alt.Ped, { everyTick = true } = {}): void {
  game.taskSetBlockingOfNonTemporaryEvents(ped, true);
  game.setPedConfigFlag(ped, PED_CONFIG_FLAG.TreatAsFriendlyForTargetingAndDamage, true);
  game.setPedConfigFlag(ped, PED_CONFIG_FLAG.DisableExplosionReactions, true);
  game.setRagdollBlockingFlags(ped, RAGDOLL_BLOCKING_FLAGS.RBF_ALL);
  game.setEntityProofs(ped, true, true, true, true, true, true, true, true);
  game.setPedRelationshipGroupHash(ped, alt.hash("Friendly"));

  if (everyTick) {
    everyTickWhile(
      () => ped.valid,
      () => {
        game.setPedConfigFlag(ped, PED_CONFIG_FLAG.TreatAsFriendlyForTargetingAndDamage, true);
        game.setPedResetFlag(ped, PED_RESET_FLAG.BlockFallTaskFromExplosionDamage, true);
        game.setPedResetFlag(ped, PED_RESET_FLAG.BlockWeaponReactionsUnlessDead, true);
        game.setPedResetFlag(ped, PED_RESET_FLAG.DisablePotentialBlastReactions, true);

        if (game.isPedFleeing(ped)) {
          game.clearPedTasksImmediately(ped);
          setupPeacefulPed(ped, { everyTick: false });
        }
      },
    );
  }
}
