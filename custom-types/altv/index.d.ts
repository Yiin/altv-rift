declare module "@altv/server" {
  export interface Player {
    hasFullySpawned: boolean;
  }

  export interface BaseObjectMeta {
    capacity?: number;
  }
}

declare module "@altv/client" {
  type IWebviewEventHandler = (...args: any[]) => any;

  export interface IWebviewEvent {
    VIEW_READY: IWebviewEventHandler;
    PLAY_SOUND: IWebviewEventHandler;
  }

  export interface PedMeta {}
}

declare module "@altv/shared" {
  export interface PedStreamSyncedMeta {
    key?: import("../../src/shared/modules/npc/list").Npc;
    name?: string;
  }

  export interface VirtualEntityStreamSyncedMeta {
    entityType: "tree";
    treeType?: import("../../src/shared/modules/woodcutting/interfaces").TreeType;
    cooldownUntil?: number;
  }
}
