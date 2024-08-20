import alt from "@altv/client";
import game from "@altv/natives";
import { WindowType } from "@shared/store/client.store";
import { closeWindow, isWindowOpen, openWindow, useWebview } from "../user-interface/webview";
import { reactive, watch } from "vue";
import { ClientEvents } from "@shared/events/client";
import { loadSceneAtCoords } from "../utility/scene";
import { isTyping } from "../user-interface/event-helpers";
import Raycast from "../utility/raycast";

let cam: number | null = null;

const pos = reactive({
  x: 0,
  y: 0,
  z: 0
});

const rot = reactive({
  x: 0,
  y: 0,
  z: 0
});

let lastTick: number | null = null;

watch(pos, () => {
  if (!cam) {
    return;
  }

  const z = Math.max(pos.z, game.getApproxHeightForPoint(pos.x, pos.y));

  if (z !== pos.z) {
    pos.z = z;
  }

  game.setCamCoord(cam, pos.x, pos.y, z);
});

watch(rot, () => {
  if (!cam) {
    return;
  }

  game.setCamRot(cam, rot.x, rot.y, rot.z, 2);
});

alt.Timers.setInterval(() => {
  if (!isBuilderEnabled()) {
    return;
  }

  alt.FocusData.focusOverridePos = new alt.Vector3({
    x: pos.x,
    y: pos.y,
    z: game.getApproxHeightForPoint(pos.x, pos.y)
  });
}, 1000);

function isBuilderEnabled() {
  return isWindowOpen(WindowType.BUILDER);
}

function enableBuilder() {
  openWindow(WindowType.BUILDER);
  alt.setGameControlsActive(true);

  Object.assign(pos, alt.Player.local.pos.add(0, 0, 50));
  Object.assign(rot, new alt.Vector3(270, 0, 0));
  const fov = 20;

  cam = game.createCamWithParams(
    'DEFAULT_SCRIPTED_CAMERA',
    pos.x,
    pos.y,
    pos.z,
    rot.x,
    rot.y,
    rot.z,
    fov,
    true,
    2
  );

  game.setCamActive(cam, true);
  game.renderScriptCams(true, false, 0, true, false, 0);

  game.setEntityAlpha(alt.Player.local, 0, false);
  game.giveWeaponToPed(alt.Player.local, alt.hash('WEAPON_UNARMED'), 1, false, true);
  alt.Player.local.frozen = true;
}

function disableBuilder() {
  if (!isBuilderEnabled()) {
    return;
  }
  closeWindow();

  if (cam) {
    game.setCamActive(cam, false);
    game.destroyCam(cam, true);
    game.clearFocus();
    game.renderScriptCams(false, false, 0, false, false, 0);
    cam = null;
  }

  game.setEntityAlpha(alt.Player.local, 255, false);
  if (alt.Player.local.weapons[0]?.hash) {
    game.setCurrentPedWeapon(alt.Player.local, alt.Player.local.weapons[0].hash, true);
  }
  alt.Player.local.frozen = false;

  if (alt.FocusData.isFocusOverriden) {
    alt.FocusData.clearFocusOverride();
  }
}

alt.Timers.everyTick(() => {
  if (!isBuilderEnabled()) {
    return;
  }

  if (isTyping()) {
    return;
  }

  const delta = lastTick ? Date.now() - lastTick : 16;

  if (alt.getKeyState(alt.Enums.KeyCode.Q).isDown) {
    rot.y = ((rot.y - delta * 0.05) + 360) % 360;
  }
  if (alt.getKeyState(alt.Enums.KeyCode.E).isDown) {
    rot.y = ((rot.y + delta * 0.05) + 360) % 360;
  }

  /**
   * Move camera based on rot.y, so if we're holding W, we're moving the camera forward
   * to the direction we're facing.
   */

  const rad = rot.y * (Math.PI / 180);
  const sin = Math.sin(rad) * delta * 0.01;
  const cos = Math.cos(rad) * delta * 0.01;

  if (alt.getKeyState(alt.Enums.KeyCode.W).isDown) {
    pos.x += sin;
    pos.y += cos;
  }

  if (alt.getKeyState(alt.Enums.KeyCode.S).isDown) {
    pos.x -= sin;
    pos.y -= cos;
  }

  if (alt.getKeyState(alt.Enums.KeyCode.A).isDown) {
    pos.x -= cos;
    pos.y += sin;
  }

  if (alt.getKeyState(alt.Enums.KeyCode.D).isDown) {
    pos.x += cos;
    pos.y -= sin;
  }
});

useWebview((webview) => {
  webview.on(ClientEvents.FromWebview.WHEEL_DOWN, (deltaY) => {
    if (!isBuilderEnabled()) {
      return;
    }
    pos.z += deltaY * 0.12;
  });

  webview.on(ClientEvents.FromWebview.WHEEL_UP, (deltaY) => {
    if (!isBuilderEnabled()) {
      return;
    }
    pos.z -= deltaY * 0.12;
  });

  webview.on(ClientEvents.FromWebview.LEFT_CLICK, (pos) => {
    if (!isBuilderEnabled()) {
      alt.log('builder not enabled');
      return;
    }

    const worldPos = Raycast.screenPosToWorldPos(pos);
    if (!worldPos) {
      alt.log('no world pos', pos);
      return;
    }

    alt.log('left click', worldPos);
    alt.Drawing.drawText3d('left click', worldPos);
  });

  webview.on(ClientEvents.FromWebview.RIGHT_CLICK, (pos) => {
    if (!isBuilderEnabled()) {
      return;
    }

    const worldPos = Raycast.screenPosToWorldPos(pos);
    if (!worldPos) {
      return;
    }

    alt.log('right click', worldPos);
    alt.Drawing.drawText3d('right click', worldPos);
  });
});

alt.Events.onKeyDown(({ key }) => {
  if (isTyping()) {
    return;
  }

  if (key === alt.Enums.KeyCode["'"]) {
    if (isBuilderEnabled()) {
      disableBuilder();
    } else {
      enableBuilder();
    }
    return;
  }
});
