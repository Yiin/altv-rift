import { PedFlags } from "../../modules/ped";
import { StorageType } from "../../store/game-state.store";

declare module "@altv/server" {
  export interface Player {
    objectInHand?: import("@altv/server").Object["id"];
  }

  export interface BaseObjectMeta {
    capacity?: number; // tree
    databaseId?: string; // item
  }

  export class Test {
    text: string;
  }
}

declare module "@altv/client" {
  type IWebviewEventHandler = (...args: any[]) => any;

  export interface IWebviewEvent {
    VIEW_READY: IWebviewEventHandler;
    PLAY_SOUND: IWebviewEventHandler;
  }

  export interface PedMeta {}

  export interface Entity {
    reactiveStreamSyncedMeta: any;
  }

  export interface VirtualEntity {
    reactiveStreamSyncedMeta: any;
  }
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
    capacity?: number; // entityType: tree & entityType: ore
    item?: import("../../modules/items").Item; // entityType: item
    storageType?: StorageType; // entityType: storage
    storageLabel?: string; // entityType: storage
    windowType?: WindowType; // entityType: storage
    interpolate?: {
      ts: number;
      from: alt.Vector3;
      speed: number;
    }; // entityType: storage & storageType: AirDrop
    airDropType?: import("../../modules/items/registry/air-drop").AirDropType; // entityType: storage & storageType: AirDrop
    areaName?: string; // entityType: areaOfInterest
    areaType?: string; // entityType: areaOfInterest
    areaDescription?: string; // entityType: areaOfInterest
    blipType?: import("../../modules/game/ui/blips").BlipType; // entityType: areaOfInterest | entityType: storage & storageType: AirDrop
    blipColor?: import("../../modules/game/ui/blips").BlipColor; // entityType: areaOfInterest
    oreType?: import("../../modules/items").Ore; // entityType: ore
    description?: string; // entityType: savedPoint
  }
}
