import { createHookableFunction } from "@shared/hooks";
import { ItemSource } from "@shared/interfaces";
import { Item } from "@shared/modules/items";
import { ServerEvents } from "@shared/events/server";
import { InGamePlayer } from "@/core/utility/assertions";
import { emit } from "@/core/events/emit";

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
  },
);

/**
 * Can player equip items? E.g. if player is dying or immobilized, he can't equip anything.
 */
export const canEquipItems = createHookableFunction<(player: InGamePlayer) => boolean>({
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
