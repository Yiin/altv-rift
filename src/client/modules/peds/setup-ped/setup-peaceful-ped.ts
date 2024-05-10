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

  executeTask(ped);

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

alt.Events.onStreamSyncedMetaChange(({ entity, key, newValue }) => {
  if (entity instanceof alt.Ped && key === "task") {
    executeTask(entity);
  }
});

function executeTask(ped: alt.Ped) {
  const task = ped.streamSyncedMeta.task as any;

  if (!task) {
    game.clearPedTasksImmediately(ped);
    game.taskSetBlockingOfNonTemporaryEvents(ped, true);
    return;
  }

  if (task.type === "animation") {
    console.log("Playing animation", task.dict, task.name, task.speed, task.duration);
    game.taskPlayAnim(ped, task.dict, task.name, 8, 8, task.duration, 0, 0, false, false, false);
  }
}
