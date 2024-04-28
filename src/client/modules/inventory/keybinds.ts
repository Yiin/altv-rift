import alt from "@altv/client";
import game from "@altv/natives";
import { watch } from "vue";
import { WindowType } from "@shared/store/client.store";
import { ServerCall } from "@shared/calls/server";
import { EquipmentSlot } from "@shared/interfaces";
import { onKeyDown } from "@/core/utility/event-helpers";
import { clientState } from "@/core/store/client.store";
import { closeWindow, openWindow, toggleWindow } from "@/core/user-interface/webview";
import { whileInGame } from "@/core/game-state-hooks/in-game.state";
import { useCharacter } from "@/core/store/character.store";
import { rpc } from "@/core/rpc";
import { updatePlayerPedPreview } from "./player-ped-preview";

whileInGame(() => {
  const inventoryToggleHandler = onKeyDown(alt.Enums.KeyCode.B, togglePlayerInventory);
  const quickSlotHandlers = (
    [
      alt.Enums.KeyCode.KEY1,
      alt.Enums.KeyCode.KEY2,
      alt.Enums.KeyCode.KEY3,
      alt.Enums.KeyCode.KEY4,
    ] as const
  ).map((key) => onKeyDown(key, handleQuickSlot));

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
    inventoryToggleHandler.destroy();
    quickSlotHandlers.forEach((handler) => handler.destroy());
    stopWatching();
  };
});

export function togglePlayerInventory() {
  toggleWindow(WindowType.PLAYER_INVENTORY);
}

function handleQuickSlot(
  key:
    | alt.Enums.KeyCode.KEY1
    | alt.Enums.KeyCode.KEY2
    | alt.Enums.KeyCode.KEY3
    | alt.Enums.KeyCode.KEY4,
) {
  const quickSlot = (
    {
      [alt.Enums.KeyCode.KEY1]: EquipmentSlot.QuickSlot1,
      [alt.Enums.KeyCode.KEY2]: EquipmentSlot.QuickSlot2,
      [alt.Enums.KeyCode.KEY3]: EquipmentSlot.QuickSlot3,
      [alt.Enums.KeyCode.KEY4]: EquipmentSlot.QuickSlot4,
    } as const
  )[key];
  alt.log("Handling quick slot", quickSlot);

  rpc.callServer(ServerCall.FromClient.USE_QUICK_SLOT, quickSlot);
}
