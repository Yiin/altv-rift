import { PedFlags } from "../../src/shared/modules/ped";
import { StorageType } from "../../src/shared/store/game-state.store";

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
    key?: import("../../src/shared/modules/ped/list").PedKey;
    flags?: PedFlags;
    name?: string;
    weapon?: number;
  }

  export interface VirtualEntityStreamSyncedMeta {
    entityType: "tree" | "item" | "storage";
    treeType?: import("../../src/shared/modules/woodcutting/interfaces").TreeType; // entityType: tree
    cooldownUntil?: number; // entityType: tree
    item?: import("../../src/shared/modules/items").Item; // entityType: item
    storageType?: StorageType; // entityType: storage
    interpolate?: {
      ts: number;
      from: alt.Vector3;
      speed: number;
    }; // entityType: storage & storageType: AirDrop
  }
}
