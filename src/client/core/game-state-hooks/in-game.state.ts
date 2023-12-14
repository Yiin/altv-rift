import { computed, ref, watch } from "vue";
import { isCharacterStoreAvailable } from "@/core/store/character.store";
import { isConnected } from "./connected.state";

export const isInGame = computed(() => isConnected.value && isCharacterStoreAvailable.value);

export function whileInGame(fn: () => MaybePromise<(() => void) | void>) {
  const cleanup = ref<(() => void) | void>();

  watch(isInGame, async (value) => {
    if (value) {
      cleanup.value = await fn();
    } else if (cleanup.value) {
      cleanup.value();
      cleanup.value = undefined;
    }
  });
}
