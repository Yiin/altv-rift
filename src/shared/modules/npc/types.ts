import alt from "alt-client";
import { Npc } from "./npc";
import * as tasks from "./tasks";

export enum TaskType {
  GoTo = "GoTo",
  AimAt = "AimAt",
  ShootAt = "ShootAt",
}

export type Task = ReturnType<(typeof tasks)[keyof typeof tasks]>;

export type PedID = Brand<number, "PedID">;
export type NpcID = Brand<number, "NpcID">;

export enum PedType {
  STATIC = 0,
  MISSION = 1,
}

export type LastUpdateTimestamp = Brand<number, "LastUpdateTimestamp">;

export type NpcSyncPayload = Pick<Npc, "id"> &
  Partial<
    Omit<Npc, "id" | "velocity" | "rotationVelocity"> & {
      velocity: alt.Vector3;
      rotationVelocity: alt.Vector3;
    }
  >;
