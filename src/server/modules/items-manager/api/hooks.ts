import { createHookableFunction } from "@shared/hooks";
import { Inventory, InventoryItemSource, ItemSource } from "@shared/interfaces";
import { Item } from "@shared/modules/items";
import { InGamePlayer } from "@/utility/assertions";

export const findSourceInventory = createHookableFunction<
  (source: InventoryItemSource) => Inventory | null
>({
  name: "findSourceInventory",
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
 * Can player do anything with the item?
 */
export const canInteractWithItem = createHookableFunction<
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
  (player: InGamePlayer, source: ItemSource) => boolean
>({
  name: "useItemFromSource",
  defaultReturn: false,
});

/**
 * Tries to use the item. If none of the item hooks return true, it won't be used.
 */
export const useItem = createHookableFunction<(player: InGamePlayer, item: Item) => boolean>({
  name: "the",
  defaultReturn: false,
});

/**
 * Can player equip the item? E.g. if player is dying or immobilized, he can't equip anything.
 */
export const canEquipItem = createHookableFunction<
  (player: InGamePlayer, source: ItemSource) => boolean
>({
  name: "canEquipItem",
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
