import alt from "alt-client";
import native from "natives";
import { TaskType } from "@shared/modules/npc/types";
import { MOVE_BLEND_RATIO } from "../constants/move-blend-ratio";
import { NAV_SCRIPT_FLAGS } from "../constants/nav-script-flags";
import { StreamedNpc } from "../ped";

export function runCurrentTask(this: StreamedNpc) {
  const task = this.npc.currentTask;

  if (!task) {
    return;
  }

  this.runningTask = task;

  switch (task.type) {
    case TaskType.GoTo: {
      native.taskFollowNavMeshToCoord(
        this.ped,
        task.pos.x,
        task.pos.y,
        task.pos.z,
        MOVE_BLEND_RATIO.WALK,
        -1,
        0,
        NAV_SCRIPT_FLAGS.ENAV_DEFAULT,
        0
      );
      break;
    }
    case TaskType.AimAt: {
      const target = [alt.Player.local, ...alt.Player.streamedIn].find(
        (player) => player.id === task.targetId
      );

      if (target) {
        native.taskAimGunAtEntity(this.ped, target.scriptID, -1, true);
      }
      break;
    }
    case TaskType.ShootAt: {
      const target = alt.Player.streamedIn.find(
        (player) => player.id === task.targetId
      );

      if (target) {
        native.taskShootAtEntity(
          this.ped,
          target.scriptID,
          -1,
          alt.hash("FIRING_PATTERN_FULL_AUTO")
        );
      }
    }
  }
}
