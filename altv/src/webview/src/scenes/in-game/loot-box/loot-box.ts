import { useGameState } from "@/store/synced/game-state.store";

export function useLootBox() {
  const gameState = useGameState();

  if (!gameState.openedStorage) {
    throw new Error("No loot box is open.");
  }

  return gameState.openedStorage;
}
