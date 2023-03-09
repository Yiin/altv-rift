import { usePlayerStore } from "@shared/store/player.store";
import { pinia } from ".";

export const playerStore = usePlayerStore(pinia);
