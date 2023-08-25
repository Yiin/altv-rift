import alt from "alt-client";
import game from "natives";
import { KeyCode } from "altv-enums";
import { computed, watch } from "vue";
import { ItemType } from "@prisma/client/edge";
import { ServerEvents } from "@shared/events/server";
import { ServerCall } from "@shared/calls/server";
import { getItemData } from "@shared/modules/items";
import { rpc } from "@/rpc";
import { playerStore } from "@/store/player.store";
import { waitNextTick } from "@/utility/event-helpers";
import { Control, ControlType } from "@/constants/controls";

const player = alt.Player.local;

alt.on("playerWeaponShoot", () => {
  alt.emitServerRaw(ServerEvents.FromClient.WEAPON_SHOOT);
});

alt.on("keydown", async (key) => {
  if (key === KeyCode.R) {
    startReloading();
  }
});

const noAmmoLeft = computed(() => {
  const weapon = playerStore.character?.equipment.weapon;

  if (!weapon) {
    return false;
  }

  if (weapon.type !== ItemType.FIREARM_WEAPON) {
    return false;
  }

  const weaponData = getItemData(weapon);

  return !weaponData.ammo || weaponData.ammo.clip.amount <= 0;
});

alt.everyTick(() => {
  if (reloading) {
    game.disableControlAction(ControlType.PLAYER_CONTROL, Control.INPUT_MELEE_ATTACK_LIGHT, true);
  }

  if (reloading || noAmmoLeft.value) {
    game.disablePlayerFiring(player.scriptID, true);
  }
});

let reloading = false;

async function startReloading() {
  if (reloading) {
    return;
  }

  reloading = true;

  const startReload = await rpc.callServer(ServerCall.FromClient.RELOAD_WEAPON);

  if (startReload) {
    game.setPedInfiniteAmmoClip(player.scriptID, false);
    game.setAmmoInClip(player.scriptID, player.currentWeapon, 1);
    await waitNextTick();
    game.taskReloadWeapon(alt.Player.local.scriptID, true);
    await waitNextTick();
    game.setPedInfiniteAmmoClip(player.scriptID, true);
  }
  reloading = false;
}

watch(
  noAmmoLeft,
  async (noAmmoLeft) => {
    if (noAmmoLeft) {
      await startReloading();
    }
  },
  { deep: true }
);

alt.on("playerWeaponChange", () => {
  game.setPedInfiniteAmmo(player.scriptID, true, player.currentWeapon);
  game.setPedInfiniteAmmoClip(player.scriptID, true);
});
