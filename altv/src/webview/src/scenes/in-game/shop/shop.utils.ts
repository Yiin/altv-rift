import type { InventoryItem } from "@shared/interfaces";
import { useCharacter } from "@/store/synced/character.store";

export function canBuy(inventoryItem: InventoryItem) {
  const character = useCharacter();

  const price = inventoryItem.price;

  if (!price) {
    return 0;
  }

  const money = character.money;

  return ~~(money / price);
}
