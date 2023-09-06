import { computed, watch } from "vue";
import { isCharacterStoreAvailable } from "@/store/character.store";

export const isInGame = computed(() => {
  return isCharacterStoreAvailable.value;
});

let cleanup: (() => void) | void;

export function whileInGame(fn: () => (() => void) | void) {
  watch(isInGame, (value) => {
    if (value) {
      cleanup = fn();
    } else if (cleanup) {
      cleanup();
      cleanup = undefined;
    }
  });
}
