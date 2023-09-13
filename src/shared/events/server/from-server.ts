import alt from "alt-server";
import { EquipmentSlot } from "@shared/interfaces";
import { Item } from "@shared/modules/items";
import { InGamePlayer } from "../../../server/utility/assertions";

export const FromServer = {
  MANUAL_DISCORD_AUTH_DONE: "MANUAL_DISCORD_AUTH_DONE",
  USE_ITEM: "USE_ITEM",
  EQUIP_ITEM: "EQUIP_ITEM", // Handles equipment effects, not player equipment state
  UNEQUIP_ITEM: "UNEQUIP_ITEM",
  DROP_ITEM: "DROP_ITEM",
} as const;

declare module "alt-server" {
  export interface ICustomEmitEvent {
    [FromServer.MANUAL_DISCORD_AUTH_DONE]: (
      player: alt.Player,
      token: string
    ) => Promise<void> | void;
    [FromServer.USE_ITEM]: (player: InGamePlayer, item: Item) => Promise<void> | void;
    [FromServer.EQUIP_ITEM]: (player: InGamePlayer, item: Item) => Promise<void> | void;
    [FromServer.UNEQUIP_ITEM]: (
      player: InGamePlayer,
      equipmentSlot: EquipmentSlot
    ) => Promise<void> | void;
    [FromServer.DROP_ITEM]: (player: InGamePlayer, item: Item) => Promise<void> | void;
  }
}
