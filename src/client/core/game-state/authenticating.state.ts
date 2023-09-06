import { computed, watch } from "vue";
import { isUserStoreAvailable } from "@/store/user.store";

export const isAuthenticating = computed(() => !isUserStoreAvailable.value);

let cleanup: (() => void) | void;

export function whileAuthenticating(fn: () => (() => void) | void) {
  watch(isAuthenticating, (value) => {
    if (value) {
      cleanup = fn();
    } else if (cleanup) {
      cleanup();
      cleanup = undefined;
    }
  });
}
