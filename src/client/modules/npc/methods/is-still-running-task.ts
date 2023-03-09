import native from "natives";
import { TaskType } from "@shared/modules/npc/types";
import { NAVMESH_ROUTE_RESULT } from "../constants/task";
import { StreamedNpc } from "../ped";

export function isStillRunningTask(this: StreamedNpc) {
  switch (this.runningTask?.type) {
    case TaskType.GoTo: {
      if (
        native.isPedWalking(this.ped) ||
        native.isPedRunning(this.ped) ||
        native.isPedSprinting(this.ped) ||
        native.isPedStrafing(this.ped) ||
        native.isPedJumping(this.ped) ||
        native.isPedClimbing(this.ped) ||
        native.getNavmeshRouteResult(this.ped) !==
          NAVMESH_ROUTE_RESULT.NAVMESHROUTE_TASK_NOT_FOUND ||
        native.getDistanceBetweenCoords(
          this.runningTask.pos.x,
          this.runningTask.pos.y,
          this.runningTask.pos.z,
          native.getEntityCoords(this.ped, false).x,
          native.getEntityCoords(this.ped, false).y,
          native.getEntityCoords(this.ped, false).z,
          true
        ) > 1
      ) {
        return true;
      } else if (this.taskIsRunning) {
        return false;
      }
    }
    case TaskType.AimAt: {
      if (native.isPlayerFreeAiming(this.ped)) {
        return true;
      }
    }
    case TaskType.ShootAt: {
      if (native.isPedShooting(this.ped)) {
        return true;
      }
    }
  }

  return false;
}
