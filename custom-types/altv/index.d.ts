declare module "alt-shared" {
  export interface ICustomPlayerSyncedMeta {}
}

declare module "alt-server" {
  export interface Player {
    pinia: import("pinia").Pinia;
    store: ReturnType<
      typeof import("../../src/shared/store/player.store").usePlayerStore
    >;
    hasFullySpawned: boolean;
  }

  // export function on<K extends string, L extends (...args: any[]) => void>(
  //   eventName: K,
  //   listener: L
  // ): void;

  export interface ICustomServerEvent {
    USER_LOADED: (player: import("alt-server").Player) => Promise<void> | void;
  }

  export interface ICustomColshapeMeta {
    npcId?: import("../../src/shared/modules/npc/npc").Npc["id"];
  }

  type IClientEventHandler = (
    player: import("alt-server").Player,
    ...args: any[]
  ) => any;

  export type IClientEvent = {
    [key in keyof typeof import("../../src/shared/constants/events").Events.Server]: IClientEventHandler;
  };
}

declare module "alt-client" {
  export function on<K extends string, L extends (...args: any[]) => void>(
    eventName: K,
    listener: L
  ): void;

  export interface ICustomClientEvent {}

  type IServerEventHandler = (...args: any[]) => any;

  export type IServerEvent = {
    [key in keyof typeof import("../../src/shared/constants/events").Events.Client]: IServerEventHandler;
  };

  type IWebviewEventHandler = (...args: any[]) => any;

  export interface IWebviewEvent {
    VIEW_READY: IWebviewEventHandler;
    PLAY_SOUND: IWebviewEventHandler;
  }
}
