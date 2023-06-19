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
  DYNAMIC = 1,
}

export type LastUpdateTimestamp = Brand<number, "LastUpdateTimestamp">;

export type NpcSyncPayload = Pick<Npc, "id"> &
  Partial<
    Omit<Npc, "id" | "velocity" | "rotationVelocity"> & {
      velocity: alt.Vector3;
      rotationVelocity: alt.Vector3;
    }
  >;

export enum NpcFlags {
  None = 0,
  Quest = 1 << 0,
  ShopKeeper = 1 << 2,
  Talkable = 1 << 1,
}

export type DynamicNpcMeta = {
  // maxHealth: number;
};

export type StaticNpcMeta = {
  name: string;
};

export type NpcMeta<T = unknown> = (T extends PedType.DYNAMIC
  ? DynamicNpcMeta & Partial<StaticNpcMeta>
  : T extends PedType.STATIC
  ? StaticNpcMeta & Partial<DynamicNpcMeta>
  : Partial<DynamicNpcMeta & StaticNpcMeta>) & {
  flags: NpcFlags;
};
