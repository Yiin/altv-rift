import * as alt from "@altv/client";
import * as game from "@altv/natives";
import { RAGDOLL_BLOCKING_FLAGS } from "@shared/enums/ragdoll-blocking-flags";
import { everyTickWhile } from "@/core/utility/event-helpers";
import { PED_RESET_FLAG } from "@/core/constants/ped-flags";

export function setupPeacefulPed(ped: alt.Ped) {
  game.taskSetBlockingOfNonTemporaryEvents(ped, true);
  game.setPedTreatedAsFriendly(ped, true, false);
  game.setRagdollBlockingFlags(ped, RAGDOLL_BLOCKING_FLAGS.RBF_ALL);
  game.setEntityProofs(ped, true, true, true, true, true, true, true, true);
  game.setPedRelationshipGroupHash(ped, alt.hash("Friendly"));

  everyTickWhile(
    () => ped.valid,
    () => {
      game.setPedResetFlag(alt.Player.local, PED_RESET_FLAG.PreventLockonToFriendlyPlayers, true);
      game.setPedResetFlag(ped, PED_RESET_FLAG.BlockFallTaskFromExplosionDamage, true);
      game.setPedResetFlag(ped, PED_RESET_FLAG.BlockWeaponReactionsUnlessDead, true);
      game.setPedResetFlag(ped, PED_RESET_FLAG.DisablePotentialBlastReactions, true);
    }
  );
}
