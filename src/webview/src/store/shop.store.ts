import { ItemSourceOrigin } from "@shared/interfaces";
import { StorageType } from "@shared/store/game-state.store";
import { InventoryInteractionType, getCurrentInventoryInteraction } from "./inventory";
import { useGameState } from "./synced/game-state.store";

const gameState = useGameState();

export function isInShop() {
  return gameState.openedStorage?.type === StorageType.Shop;
}

export function isBuying() {
  const currentInteraction = getCurrentInventoryInteraction();

  return (
    isInShop() &&
    currentInteraction.type === InventoryInteractionType.TransferingAmount &&
    currentInteraction.state.item.source.origin === ItemSourceOrigin.Storage &&
    currentInteraction.state.to?.origin === ItemSourceOrigin.PlayerInventory
  );
}

export function isSelling() {
  const currentInteraction = getCurrentInventoryInteraction();

  return (
    isInShop() &&
    currentInteraction.type === InventoryInteractionType.TransferingAmount &&
    currentInteraction.state.to?.origin === ItemSourceOrigin.Storage &&
    currentInteraction.state.item.source.origin === ItemSourceOrigin.PlayerInventory
  );
}

export function getShopItem() {
  const currentInteraction = getCurrentInventoryInteraction();

  if (!isInShop()) {
    return null;
  }

  if (currentInteraction.type !== InventoryInteractionType.TransferingAmount) {
    return null;
  }

  return currentInteraction.state.item;
}
