import alt from "@altv/client";
import { ref, watch } from "vue";
import { whileInGame } from "./in-game.state";

export const isInVehicle = ref(false);

whileInGame(() => {
  if (alt.Player.local.isInVehicle) {
    isInVehicle.value = true;
  }

  const onPlayerEnterVehicle = alt.Events.onPlayerVehicleEntered(({ player }) => {
    if (player === alt.Player.local) {
      isInVehicle.value = true;
    }
  });

  const onPlayerLeaveVehicle = alt.Events.onPlayerVehicleLeft(({ player }) => {
    if (player === alt.Player.local) {
      isInVehicle.value = false;
    }
  });

  return () => {
    onPlayerEnterVehicle.destroy();
    onPlayerLeaveVehicle.destroy();
    isInVehicle.value = false;
  };
});

export function whileInVehicle(fn: () => MaybePromise<(() => void) | void>): void {
  const cleanup = ref<(() => void) | void>();

  watch(isInVehicle, async (value) => {
    if (value) {
      cleanup.value = await fn();
    } else if (cleanup.value) {
      cleanup.value();
      cleanup.value = undefined;
    }
  });
}
