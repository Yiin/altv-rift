import { computed, watch } from "vue";
import { isUserStoreAvailable } from "@/store/user.store";
import { isCharacterStoreAvailable } from "@/store/character.store";

export const isCreatingCharacter = computed(
  () => isUserStoreAvailable.value && !isCharacterStoreAvailable.value
);

let cleanup: (() => void) | void;

export function whileAuthenticating(fn: () => (() => void) | void) {
  watch(isCreatingCharacter, (value) => {
    if (value) {
      cleanup = fn();
    } else if (cleanup) {
      cleanup();
      cleanup = undefined;
    }
  });
}
