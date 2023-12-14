import { computed, ref, watch } from "vue";
import { isUserStoreAvailable } from "@/core/store/user.store";
import { isConnected } from "./connected.state";

export const isAuthenticating = computed(() => !isUserStoreAvailable.value && isConnected.value);

export function whileAuthenticating(fn: () => MaybePromise<(() => void) | void>) {
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
