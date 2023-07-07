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
}

declare module "alt-client" {
  // export function on<K extends string, L extends (...args: any[]) => void>(
  //   eventName: K,
  //   listener: L
  // ): void;

  type IWebviewEventHandler = (...args: any[]) => any;

  export interface IWebviewEvent {
    VIEW_READY: IWebviewEventHandler;
    PLAY_SOUND: IWebviewEventHandler;
  }
}
