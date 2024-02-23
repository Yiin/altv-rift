import alt from "@altv/client";
import { computed, ref, watch } from "vue";
import { isInVehicle } from "./in-vehicle.state";
import { isConnected } from "./connected.state";

export const isInDriverSeat = computed(
  () => isConnected.value && isInVehicle.value && alt.Player.local.seat === 1
);

export function whileInDriverSeat(fn: () => MaybePromise<(() => void) | void>) {
  const cleanup = ref<(() => void) | void>();

  watch(isInDriverSeat, async (value) => {
    if (value) {
      cleanup.value = await fn();
    } else if (cleanup.value) {
      cleanup.value();
      cleanup.value = undefined;
    }
  });
}
