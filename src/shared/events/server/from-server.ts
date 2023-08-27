import { LocalItemSource, EquipmentSlot, Item } from "@shared/interfaces";

export const FromServer = {
  MANUAL_DISCORD_AUTH_DONE: "MANUAL_DISCORD_AUTH_DONE",
  USE_ITEM: "USE_ITEM",
  EQUIP_ITEM: "EQUIP_ITEM", // Handles equipment effects, not player equipment state
  UNEQUIP_ITEM: "UNEQUIP_ITEM",
  DROP_ITEM: "DROP_ITEM",
} as const;

export interface EventFromServer {
  [FromServer.MANUAL_DISCORD_AUTH_DONE]: (
    player: import("alt-server").Player,
    token: string
  ) => Promise<void> | void;
  [FromServer.USE_ITEM]: (
    player: import("../../../server/utility/assertions").InGamePlayer,
    item: Item
  ) => Promise<void> | void;
  [FromServer.EQUIP_ITEM]: (
    player: import("../../../server/utility/assertions").InGamePlayer,
    item: Item
  ) => Promise<void> | void;
  [FromServer.UNEQUIP_ITEM]: (
    player: import("../../../server/utility/assertions").InGamePlayer,
    equipmentSlot: EquipmentSlot
  ) => Promise<void> | void;
  [FromServer.DROP_ITEM]: (
    player: import("../../../server/utility/assertions").InGamePlayer,
    item: Item
  ) => Promise<void> | void;
}

declare module "alt-server" {
  export function emit<T extends keyof typeof FromServer>(
    eventName: T,
    ...args: Parameters<EventFromServer[T]>
  ): void;

  export function on<T extends keyof typeof FromServer>(
    eventName: T,
    listener: EventFromServer[T]
  ): void;
}
