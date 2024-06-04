import { PedFlags } from "../../modules/ped";
import { StorageType } from "../../store/game-state.store";

declare module "@altv/server" {
  export interface Player {
    hasFullySpawned: boolean;
  }

  export interface BaseObjectMeta {
    capacity?: number; // tree
    databaseId?: string; // item
  }
}

declare module "@altv/client" {
  type IWebviewEventHandler = (...args: any[]) => any;

  export interface IWebviewEvent {
    VIEW_READY: IWebviewEventHandler;
    PLAY_SOUND: IWebviewEventHandler;
  }

  export interface PedMeta { }
}

declare module "@altv/shared" {
  export interface PedStreamSyncedMeta {
    key?: import("../../modules/ped/list").PedKey;
    flags?: PedFlags;
    name?: string;
    weapon?: number;
    maxHealth: number;
    health: number;
  }

  export interface VirtualEntityStreamSyncedMeta {
    entityType: import("../../interfaces").VirtualEntityType;
    treeType?: import("../../modules/woodcutting/interfaces").TreeType; // entityType: tree
    cooldownUntil?: number; // entityType: tree
    item?: import("../../modules/items").Item; // entityType: item
    storageType?: StorageType; // entityType: storage
    storageLabel?: string; // entityType: storage
    interpolate?: {
      ts: number;
      from: alt.Vector3;
      speed: number;
    }; // entityType: storage & storageType: AirDrop
    airDropType?: import("../../modules/items/registry/air-drop").AirDropType; // entityType: storage & storageType: AirDrop
    areaName?: string; // entityType: areaOfInterest
    areaType?: string; // entityType: areaOfInterest
  }
}
