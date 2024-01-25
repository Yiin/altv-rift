import { createHookableFunction } from "@shared/hooks";
import { Character, GlobalItemSource, Inventory, InventoryItemSource, ItemSource } from "@shared/interfaces";
import { Item } from "@shared/modules/items";
import { ServerEvents } from "@shared/events/server";
import { InGamePlayer } from "@/core/utility/assertions";
import { emit } from "@/core/events/emit";
import { removeItem } from "./utils";

export const findSourceInventory = createHookableFunction<
  (source: InventoryItemSource) => Inventory | null
>({
  name: "findSourceInventory",
  defaultReturn: null,
});

export const findInventorySource = createHookableFunction<
  (inventory: Inventory) => Character | null
>({
  name: "findInventorySource",
  defaultReturn: null,
});

/**
 * Find an item by its source.
 * If player is provided, it will only search items accessible by the player.
 * Accessible to the player doesn't mean the player can interact with it.
 */
export const findItem = createHookableFunction<
  (source: ItemSource, player?: InGamePlayer) => Item | null
>({
  name: "findItem",
  defaultReturn: null,
});

/**
 * Can player do anything with the items in this source?
 */
export const canInteractWithItemSource = createHookableFunction<
  (player: InGamePlayer, source: ItemSource) => boolean
>({
  name: "canInteractWithItem",
  defaultReturn: true,
});

/**
 * Can player drop the item? Undroppable items are usually quest items (they can only be destroyed)
 */
export const canDropItem = createHookableFunction<
  (player: InGamePlayer, source: ItemSource) => boolean
>({
  name: "canDropItem",
  defaultReturn: true,
});

/**
 * Tries to use the item from the soruce. If none of the sources return true, it won't be used.
 */
export const useItemFromSource = createHookableFunction<
  (player: InGamePlayer, source: InventoryItemSource | GlobalItemSource) => number | false
>({
  name: "useItemFromSource",
  defaultReturn: false,
  onResult(result, [, source]) {
    if (result !== false && result > 0) {
      removeItem(source, result);
    }
  },
});

/**
 * Tries to use the item. If none of the item hooks return true, it won't be used.
 */
export const useItem = createHookableFunction<(player: InGamePlayer, item: Item) => number | false>(
  {
    name: "useItem",
    defaultReturn: false,
    onResult(result, [player, item]) {
      if (result !== false) {
        emit(ServerEvents.FromServer.ITEM_USE, player, item);
      }
    },
  }
);

/**
 * Can player equip items? E.g. if player is dying or immobilized, he can't equip anything.
 */
export const canEquipItems = createHookableFunction<
  (player: InGamePlayer) => boolean
>({
  name: "canEquipItems",
  defaultReturn: true,
});

/**
 * Tries to equip the item. If none of the item hooks return true, it won't be equipped.
 */
export const equipItem = createHookableFunction<
  (player: InGamePlayer, source: ItemSource) => boolean
>({
  name: "equipItem",
  defaultReturn: false,
});
