import { computed, ref, watch } from "vue";
import { isUserStoreAvailable } from "@/core/store/user.store";

export const isAuthenticating = computed(() => !isUserStoreAvailable.value);

export function whileAuthenticating(fn: () => MaybePromise<(() => void) | void>): void {
  const cleanup = ref<(() => void) | void>();

  watch(isAuthenticating, async (value) => {
    if (value) {
      cleanup.value = await fn();
    } else if (cleanup.value) {
      cleanup.value();
      cleanup.value = undefined;
    }
  });
}
