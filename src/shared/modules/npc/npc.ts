import alt from "alt-shared";
import { LastUpdateTimestamp, NpcID, NpcMeta, PedType, Task } from "./types";

export class Npc {
  weaponHash?: number;
  currentTask?: Task;
  rotation = alt.Vector3.zero;
  velocity = [0, alt.Vector3.zero] as [LastUpdateTimestamp, alt.Vector3];
  rotationVelocity = [0, alt.Vector3.zero] as [
    LastUpdateTimestamp,
    alt.Vector3
  ];
  isRagdollActive = false;
  isRunningRagdollTask = false;
  isUnderVehicle = false;

  constructor(
    public id: NpcID,
    public type: PedType,
    public modelHash: number,
    public position: alt.Vector3,
    public heading: number,
    public health: number,
    public maxHealth: number,
    public meta: NpcMeta
  ) {}
}
