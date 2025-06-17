import alt from "@altv/client";
import { watch } from "@yiin/reactive-proxy-state";
import { WindowType } from "@shared/store/client.store";
import { ServerCall } from "@shared/calls/server";
import { EquipmentSlot } from "@shared/interfaces";
import { onKeyDown } from "@/core/user-interface/event-helpers";
import { toggleWindow } from "@/core/user-interface/webview";
import { whileInGame } from "@/core/game-state-hooks/in-game.state";
import { useCharacter } from "@/core/store/character.store";
import { rpc } from "@/core/rpc";
import { updatePlayerPedPreview } from "./player-ped-preview";

whileInGame(() => {
  // Register inventory toggle keybind
  const inventoryToggleHandler = onKeyDown(alt.Enums.KeyCode.TAB, togglePlayerInventory, {
    isWindowKeybind: true,
  });

  // Register quick slot keybinds
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
    | alt.Enums.KeyCode.KEY4
    | alt.Enums.KeyCode.KEY5,
) {
  const quickSlot = (
    {
      [alt.Enums.KeyCode.KEY1]: EquipmentSlot.QuickSlot1,
      [alt.Enums.KeyCode.KEY2]: EquipmentSlot.QuickSlot2,
      [alt.Enums.KeyCode.KEY3]: EquipmentSlot.QuickSlot3,
      [alt.Enums.KeyCode.KEY4]: EquipmentSlot.QuickSlot4,
      [alt.Enums.KeyCode.KEY5]: EquipmentSlot.QuickSlot5,
    } as const
  )[key];

  rpc.callServer(ServerCall.FromClient.USE_QUICK_SLOT, quickSlot);
}
