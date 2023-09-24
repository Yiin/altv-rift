import * as alt from "@altv/client";
import * as game from "@altv/natives";
import { watch } from "vue";
import { ClientEvents } from "@shared/events/client";
import { everyTickWhile, onKeyDown } from "@/core/utility/event-helpers";
import { clientState } from "@/core/store/client.store";
import { getWebview, showCursor } from "@/core/user-interface/webview";
import { whileInGame } from "@/core/game-state-hooks/in-game.state";
import { useCharacter } from "@/core/store/character.store";

let equipmentPed: number | null = null;
let previousHudColor: alt.RGBA | null = null;

whileInGame(() => {
  onKeyDown(alt.Enums.KeyCode.B, togglePlayerInventory);
  watch(useCharacter().equipment, () => {
    alt.Timers.setTimeout(() => {
      if (equipmentPed) {
        alt.log("Updating equipment ped");
        game.clonePedToTargetAlt(alt.Player.local.scriptID, equipmentPed, true);
      }
    }, 100);
  });
});

function hideGameCursor() {
  const start = Date.now();

  everyTickWhile(
    () => start + 2000 > Date.now(),
    () => {
      game.setMouseCursorVisible(false);
    }
  );
}

alt.Events.onWindowFocusChange(() => {
  if (equipmentPed) {
    hideGameCursor();
  }
});

export function togglePlayerInventory() {
  // Show inventory only if there is no other window opened
  if (!clientState.ui.window) {
    showCursor(true);
    clientState.ui.window = {
      type: "playerInventory",
      interaction: null,
    };
    game.triggerScreenblurFadeIn(100);
  }
  // Hide the inventory if there is no other interaction opened (i.e. shop or storage or trade window)
  else if (
    clientState.ui.window.type === "playerInventory" &&
    clientState.ui.window.interaction === null
  ) {
    showCursor(false);
    clientState.ui.window = null;
    game.triggerScreenblurFadeOut(100);
  }
}

getWebview((webView) => {
  webView.on(ClientEvents.FromWebview.TOGGLE_PLAYER_PREVIEW, async (state) => {
    if (state) {
      if (equipmentPed) {
        game.deleteEntity(equipmentPed);
        equipmentPed = null;
      }
      game.activateFrontendMenu(game.getHashKey("FE_MENU_VERSION_EMPTY_NO_BACKGROUND"), false, -1);
      hideGameCursor();
      while (!equipmentPed) {
        equipmentPed = game.clonePed(alt.Player.local.scriptID, false, false, true);
        await alt.Utils.wait(10);
      }
      game.setEntityAlpha(equipmentPed, 0, false);
      game.setEntityCoordsNoOffset(
        equipmentPed,
        alt.Player.local.pos.x,
        alt.Player.local.pos.y,
        alt.Player.local.pos.z - 50,
        false,
        false,
        false
      );
      await alt.Utils.wait(300);

      if (!equipmentPed) {
        return;
      }
      game.doesEntityExist(equipmentPed);
      game.requestScaleformMovie("PAUSE_MP_MENU_PLAYER_MODEL");
      game.freezeEntityPosition(equipmentPed, true);
      game.givePedToPauseMenu(equipmentPed, 1);
      game.setEntityAlpha(equipmentPed, 255, false);
      game.setPauseMenuPedLighting(true);
      game.setPauseMenuPedSleepState(true);

      const [_, r, g, b, a] = game.getHudColour(177);
      previousHudColor = new alt.RGBA(r, g, b, a);
      game.replaceHudColourWithRgba(117, 0, 0, 0, 0);
    } else {
      game.clearPedInPauseMenu();
      game.setFrontendActive(false);
      if (previousHudColor) {
        game.replaceHudColourWithRgba(
          117,
          previousHudColor.r,
          previousHudColor.g,
          previousHudColor.b,
          previousHudColor.a
        );
      }
      if (equipmentPed) {
        game.deleteEntity(equipmentPed);
        equipmentPed = null;
      }
    }
  });
});
