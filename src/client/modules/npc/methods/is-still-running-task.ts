import game from "natives";
import { TaskType } from "@shared/modules/npc/types";
import { NAVMESH_ROUTE_RESULT } from "../constants/task";
import { StreamedNpc } from "../ped";

export function isStillRunningTask(this: StreamedNpc) {
  switch (this.runningTask?.type) {
    case TaskType.GoTo: {
      if (
        game.isPedWalking(this.ped) ||
        game.isPedRunning(this.ped) ||
        game.isPedSprinting(this.ped) ||
        game.isPedStrafing(this.ped) ||
        game.isPedJumping(this.ped) ||
        game.isPedClimbing(this.ped) ||
        game.getNavmeshRouteResult(this.ped) !==
          NAVMESH_ROUTE_RESULT.NAVMESHROUTE_TASK_NOT_FOUND ||
        game.getDistanceBetweenCoords(
          this.runningTask.pos.x,
          this.runningTask.pos.y,
          this.runningTask.pos.z,
          game.getEntityCoords(this.ped, false).x,
          game.getEntityCoords(this.ped, false).y,
          game.getEntityCoords(this.ped, false).z,
          true
        ) > 1
      ) {
        return true;
      } else if (this.taskIsRunning) {
        return false;
      }
    }
    case TaskType.AimAt: {
      if (game.isPlayerFreeAiming(this.ped)) {
        return true;
      }
    }
    case TaskType.ShootAt: {
      if (game.isPedShooting(this.ped)) {
        return true;
      }
    }
  }

  return false;
}
