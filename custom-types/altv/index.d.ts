declare module "alt-shared" {
  export interface ICustomPedStreamSyncedMeta {
    key?: import("../../src/shared/modules/npc/list").Npc;
    name?: string;
  }

  export interface ICustomVirtualEntityStreamSyncedMeta {
    entityType: "tree";
    treeType?: import("../../src/shared/modules/woodcutting/interfaces").TreeType;
    cooldownUntil?: number;
  }
}

declare module "alt-server" {
  export interface Player {
    hasFullySpawned: boolean;
  }

  export interface ICustomBaseObjectMeta {
    capacity?: number;
  }
}

declare module "alt-client" {
  import * as shared from "alt-shared";

  type IWebviewEventHandler = (...args: any[]) => any;

  export interface IWebviewEvent {
    VIEW_READY: IWebviewEventHandler;
    PLAY_SOUND: IWebviewEventHandler;
  }

  interface ICustomEmitEvent {
    gameStart(): void | Promise<void>;
  }

  export interface ICustomPedMeta extends ICustomEntityMeta {}

  export interface Ped {
    // normal meta

    setMeta<K extends string>(key: K, value: shared.InterfaceValueByKey<ICustomPedMeta, K>): void;
    setMeta<K extends shared.ExtractStringKeys<ICustomPedMeta>>(
      key: K,
      value: ICustomPedMeta[K]
    ): void;

    deleteMeta(key: string): void;
    deleteMeta<K extends shared.ExtractStringKeys<ICustomPedMeta>>(key: K): void;

    getMeta<K extends string>(key: Exclude<K, keyof ICustomPedMeta>): unknown;
    getMeta<K extends shared.ExtractStringKeys<ICustomPedMeta>>(
      key: K
    ): ICustomPedMeta[K] | undefined;

    hasMeta(key: string): boolean;
    hasMeta<K extends shared.ExtractStringKeys<ICustomPedMeta>>(key: K): boolean;

    // synced meta

    getSyncedMeta<K extends string>(key: Exclude<K, keyof shared.ICustomPedSyncedMeta>): unknown;
    getSyncedMeta<K extends shared.ExtractStringKeys<shared.ICustomPedSyncedMeta>>(
      key: K
    ): shared.ICustomPedSyncedMeta[K] | undefined;

    hasSyncedMeta(key: string): boolean;
    hasSyncedMeta<K extends shared.ExtractStringKeys<shared.ICustomPedSyncedMeta>>(key: K): boolean;

    // stream synced meta

    getStreamSyncedMeta<K extends string>(
      key: Exclude<K, keyof shared.ICustomPedStreamSyncedMeta>
    ): unknown;
    getStreamSyncedMeta<K extends shared.ExtractStringKeys<shared.ICustomPedStreamSyncedMeta>>(
      key: K
    ): shared.ICustomPedStreamSyncedMeta[K] | undefined;

    hasStreamSyncedMeta(key: string): boolean;
    hasStreamSyncedMeta<K extends shared.ExtractStringKeys<shared.ICustomPedStreamSyncedMeta>>(
      key: K
    ): boolean;
  }
}
