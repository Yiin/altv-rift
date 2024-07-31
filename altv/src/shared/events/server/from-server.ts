import alt from "@altv/server";
import { EquipmentSlot, type Inventory } from "@shared/interfaces";
import { type Item } from "@shared/modules/items";
import { type InGamePlayer } from "../../../server/core/utility/assertions";

export const FromServer = {
  USER_LOAD: "USER_LOAD",
  MANUAL_DISCORD_AUTH_DONE: "MANUAL_DISCORD_AUTH_DONE",
  ITEM_USE: "ITEM_USE",
  ITEM_EQUIP: "ITEM_EQUIP", // Handles equipment effects, not player equipment state
  ITEM_UNEQUIP: "ITEM_UNEQUIP",
  ITEM_DROP: "ITEM_DROP",
  INVENTORY_ITEM_ADD: "INVENTORY_ITEM_ADD",
} as const;

export interface CustomServerEvent {
  [FromServer.USER_LOAD]: (player: alt.Player) => Promise<void> | void;
  [FromServer.MANUAL_DISCORD_AUTH_DONE]: (
    player: alt.Player,
    token: string,
  ) => Promise<void> | void;
  [FromServer.ITEM_USE]: (player: InGamePlayer, item: Item) => Promise<void> | void;
  [FromServer.ITEM_EQUIP]: (player: InGamePlayer, item: Item) => Promise<void> | void;
  [FromServer.ITEM_UNEQUIP]: (
    player: InGamePlayer,
    equipmentSlot: EquipmentSlot,
    item: Item,
  ) => Promise<void> | void;
  [FromServer.ITEM_DROP]: (player: InGamePlayer, item: Item) => Promise<void> | void;
  [FromServer.INVENTORY_ITEM_ADD]: (event: {
    inventory: Inventory;
    item: Item;
    slot: number;
    amount: number;
  }) => Promise<void> | void;
}
