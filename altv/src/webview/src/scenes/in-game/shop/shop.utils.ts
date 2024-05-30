import type { InventoryItem } from "@shared/interfaces";
import { useCharacter } from "@/store/synced/character.store";

export function canBuy(inventoryItem: InventoryItem) {
  const character = useCharacter();

  const amount = "amount" in inventoryItem.item ? inventoryItem.item.amount : 1;
  const price = inventoryItem.price;

  if (!price) {
    return amount;
  }

  const money = character.money;

  const maxAmountToBuy = Math.min(~~(money / price), amount);

  return maxAmountToBuy;
}
