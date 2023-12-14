import * as alt from "@altv/client";
import { ref, watch } from "vue";

export const isConnected = ref(true);

alt.Events.onceDisconnect(() => {
  isConnected.value = false;
});

export function whileConnected(fn: () => MaybePromise<(() => void) | void>) {
  const cleanup = ref<(() => void) | void>();

  watch(isConnected, async (value) => {
    if (value) {
      cleanup.value = await fn();
    } else if (cleanup.value) {
      cleanup.value();
      cleanup.value = undefined;
    }
  });
}
