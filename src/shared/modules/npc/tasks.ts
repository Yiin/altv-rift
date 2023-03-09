import alt from "alt-shared";
import { TaskType } from "./types";

export const taskGoTo = (pos: alt.Vector3) =>
  ({
    type: TaskType.GoTo,
    pos,
  } as const);

export const taskAimAt = (targetId: number) =>
  ({
    type: TaskType.AimAt,
    targetId,
  } as const);

export const taskShootAt = (targetId: number) =>
  ({
    type: TaskType.ShootAt,
    targetId,
  } as const);
