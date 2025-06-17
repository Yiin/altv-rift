import { getDefaultGameState } from "@shared/store/game-state.store";
import { reactive } from "@yiin/reactive-proxy-state";

export const gameState = reactive(getDefaultGameState());
