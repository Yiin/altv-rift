import alt from "@altv/client";
import { computed, ref, watch } from "vue";
import { isInVehicle } from "./in-vehicle.state";

export const isInPassengerSeat = computed(() => isInVehicle.value && alt.Player.local.seat > 1);

export function whileInPassengerSeat(fn: () => MaybePromise<(() => void) | void>) {
  const cleanup = ref<(() => void) | void>();

  watch(isInPassengerSeat, async (value) => {
    if (value) {
      cleanup.value = await fn();
    } else if (cleanup.value) {
      cleanup.value();
      cleanup.value = undefined;
    }
  });
}
