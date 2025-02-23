import alt from "@altv/server";
import { getAngleToFaceTarget } from "@/core/utility/vector";

declare module "@altv/server" {
  interface Ped {
    taskTurnPedToFaceCoord(pos: alt.IVector3, duration: number): void;
  }
}

alt.Ped.prototype.taskTurnPedToFaceCoord = function (pos) {
  this.rot = new alt.Vector3(0, 0, getAngleToFaceTarget(this.pos, pos));
};
