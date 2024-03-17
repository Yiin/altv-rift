import alt from "@altv/client";
import game from "@altv/natives";
import { watch } from "vue";
import { WindowType } from "@shared/store/client.store";
import { onKeyDown } from "@/core/utility/event-helpers";
import { clientState } from "@/core/store/client.store";
import { closeWindow, openWindow, showCursor } from "@/core/user-interface/webview";
import { whileInGame } from "@/core/game-state-hooks/in-game.state";
import { useCharacter } from "@/core/store/character.store";
import { updatePlayerPedPreview } from "./player-ped-preview";

whileInGame(() => {
  const keyDownHandler = onKeyDown(alt.Enums.KeyCode.B, togglePlayerInventory);

  const stopWatching = watch(
    () =>
      (
        [
          "mask",
          "glasses",
          "headwear",
          "earrings",
          "top",
          "armor",
          "accessory",
          "weapon",
          "gloves",
          "lefthand",
          "righthand",
          "pants",
          "backpack",
          "shoes",
        ] as const
      ).map((visibleSlot) => useCharacter().equipment[visibleSlot]),
    () => {
      alt.Timers.setTimeout(updatePlayerPedPreview, 300);
    },
  );

  return () => {
    keyDownHandler.destroy();
    stopWatching();
  };
});

export function togglePlayerInventory() {
  // Show inventory only if there is no other window opened
  if (!clientState.ui.window) {
    openWindow(WindowType.PLAYER_INVENTORY);
    game.triggerScreenblurFadeIn(100);
  }
  // Hide the inventory if there is no other interaction opened (i.e. shop or storage or trade window)
  else if (clientState.ui.window.type === WindowType.PLAYER_INVENTORY) {
    closeWindow();
    game.triggerScreenblurFadeOut(100);
  }
}
