import * as alt from "@altv/client";
import * as game from "@altv/natives";
import { ref, watch } from "vue";
import { ClientEvents } from "@shared/events/client";
import { everyTickWhile } from "@/core/utility/event-helpers";
import { getWebview } from "@/core/user-interface/webview";
import { isConnected } from "@/core/game-state-hooks/connected.state";

let equipmentPed: number | null = null;
let previousHudColor: alt.RGBA | null = null;

export function updatePlayerPedPreview() {
  game.clonePedToTargetAlt(alt.Player.local, equipmentPed, true);
}

const isPreviewingPlayer = ref(false);

alt.Events.onWindowFocusChange(() => {
  if (equipmentPed) {
    hideGameCursor();
  }
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

getWebview((webView) => {
  webView.on(ClientEvents.FromWebview.TOGGLE_PLAYER_PREVIEW, async (state) => {
    isPreviewingPlayer.value = state;
  });
});

let isCreatingPedPreview = false;

async function createPedPreview() {
  if (isCreatingPedPreview) {
    return;
  }
  isCreatingPedPreview = true;

  if (equipmentPed) {
    clearPedPreview();
  }

  game.activateFrontendMenu(game.getHashKey("FE_MENU_VERSION_EMPTY_NO_BACKGROUND"), false, -1);
  hideGameCursor();

  while (!equipmentPed) {
    equipmentPed = game.clonePed(alt.Player.local, false, false, true);
    await alt.Utils.waitForNextTick();
  }

  // game.setEntityAlpha(equipmentPed, 0, false);
  game.setEntityCoordsNoOffset(
    equipmentPed,
    alt.Player.local.pos.x,
    alt.Player.local.pos.y,
    alt.Player.local.pos.z - 50,
    false,
    false,
    false
  );

  await alt.Utils.wait(200);

  if (!equipmentPed) {
    return;
  }

  game.requestScaleformMovie("PAUSE_MP_MENU_PLAYER_MODEL");
  game.freezeEntityPosition(equipmentPed, true);
  game.givePedToPauseMenu(equipmentPed, 1);
  game.setEntityAlpha(equipmentPed, 255, false);
  game.setPauseMenuPedLighting(true);
  game.setPauseMenuPedSleepState(true);

  const [r, g, b, a] = game.getHudColour(177);
  previousHudColor = new alt.RGBA(r, g, b, a);
  game.replaceHudColourWithRgba(117, 0, 0, 0, 0);

  isCreatingPedPreview = false;
}

async function clearPedPreview() {
  if (isCreatingPedPreview) {
    alt.log("Waiting for ped preview to finish");
    await alt.Utils.waitFor(() => !isCreatingPedPreview);
  }

  alt.log("Clearing ped preview");

  game.clearPedInPauseMenu();
  game.setFrontendActive(false);

  if (previousHudColor) {
    alt.log("Restoring hud color");
    game.replaceHudColourWithRgba(
      117,
      previousHudColor.r,
      previousHudColor.g,
      previousHudColor.b,
      previousHudColor.a
    );
  }
  if (equipmentPed) {
    alt.log("Deleting equipment ped");
    game.deleteEntity(equipmentPed);
    equipmentPed = null;
  }
}

watch(
  () => isConnected.value && isPreviewingPlayer.value,
  async (value) => {
    if (value) {
      createPedPreview();
    } else {
      clearPedPreview();
    }
  }
);
