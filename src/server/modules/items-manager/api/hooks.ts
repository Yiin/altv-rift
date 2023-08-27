import { createHookableFunction } from "@shared/hooks";
import { Inventory, InventoryItemSource, Item, ItemSource } from "@shared/interfaces";
import { InGamePlayer } from "@/utility/assertions";

export const findSourceInventory = createHookableFunction<
  (source: InventoryItemSource) => Inventory | null
>({
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
  defaultReturn: null,
});

/**
 * Can player do anything with the item?
 */
export const canInteractWithItem = createHookableFunction<
  (player: InGamePlayer, source: ItemSource) => boolean
>({
  defaultReturn: true,
});

/**
 * Can player drop the item? Undroppable items are usually quest items (they can only be destroyed)
 */
export const canDropItem = createHookableFunction<
  (player: InGamePlayer, source: ItemSource) => boolean
>({
  defaultReturn: true,
});

/**
 * Tries to use the item from the soruce. If none of the sources return true, it won't be used.
 */
export const useItemFromSource = createHookableFunction<
  (player: InGamePlayer, source: ItemSource) => boolean
>({
  defaultReturn: false,
});

/**
 * Tries to use the item. If none of the item hooks return true, it won't be used.
 */
export const useItem = createHookableFunction<(player: InGamePlayer, item: Item) => boolean>({
  defaultReturn: false,
});

/**
 * Can player equip the item? E.g. if player is dying or immobilized, he can't equip anything.
 */
export const canEquipItem = createHookableFunction<
  (player: InGamePlayer, source: ItemSource) => boolean
>({
  defaultReturn: true,
});

/**
 * Tries to equip the item. If none of the item hooks return true, it won't be equipped.
 */
export const equipItem = createHookableFunction<
  (player: InGamePlayer, source: ItemSource) => boolean
>({
  defaultReturn: false,
});
