import { PedFlags } from "../../src/shared/modules/ped";

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
    entityType: "tree" | "item";
    treeType?: import("../../src/shared/modules/woodcutting/interfaces").TreeType;
    cooldownUntil?: number;
    item?: import("../../src/shared/modules/items").Item;
  }
}
