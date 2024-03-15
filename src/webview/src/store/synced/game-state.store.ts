import { defineStore } from "pinia";
import { getDefaultGameState } from "@shared/store/game-state.store";

export const useGameState = defineStore("game-state", {
  state: getDefaultGameState,
});
