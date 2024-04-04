import { computed, ref, watch } from "vue";
import { isUserStoreAvailable, useUser } from "@/core/store/user.store";
import { isCharacterStoreAvailable } from "@/core/store/character.store";

export const isCreatingCharacter = computed(() => {
  return (
    isUserStoreAvailable.value &&
    !isCharacterStoreAvailable.value &&
    useUser().characters.length === 0
  );
});

export function whileCreatingCharacter(fn: () => MaybePromise<(() => void) | void>): void {
  const cleanup = ref<(() => void) | void>();

  watch(isCreatingCharacter, async () => {
    if (isCreatingCharacter.value) {
      cleanup.value = await fn();
    } else if (cleanup.value) {
      cleanup.value();
      cleanup.value = undefined;
    }
  });
}
