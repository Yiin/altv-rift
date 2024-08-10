import alt from "@altv/client";
import game, { getNameOfScriptWithThisId } from "@altv/natives";
import { computed, watchEffect } from "vue";
import { ServerEvents } from "@shared/events/server";
import { ServerCall } from "@shared/calls/server";
import { getItemInfoByKey, getWeaponAmmoEquipmentSlot } from "@shared/modules/items";
import {
  isItemFirearmWeapon,
  isWeaponWithClip,
} from "@shared/modules/items/registry/weapons/firearm-weapon.items";
import { rpc } from "@/core/rpc";
import { useCharacter } from "@/core/store/character.store";
import { whileInGame } from "@/core/game-state-hooks/in-game.state";
import { isTyping } from "@/core/user-interface/event-helpers";

const player = alt.Player.local;

/**
 * 1. Has clip
 * Shooting normally, sync clip and rest on each shot/weapon swap/aim action
 * 2. Has no rest
 * To prevent player weapon from disappearing, we set ammo to infinite and clip to clip amount
 */

whileInGame(() => {
  const currentFirearm = computed(() => {
    const character = useCharacter();
    const weapon = character.equipment.weapon;

    if (!weapon) {
      return null;
    }

    if (!isItemFirearmWeapon(weapon)) {
      return null;
    }

    return weapon;
  });

  const currentAmmo = computed(() => {
    if (!currentFirearm.value) {
      return null;
    }

    const ammoSlot = getWeaponAmmoEquipmentSlot(currentFirearm.value.key);

    const character = useCharacter();
    const equippedAmmo = character.equipment[ammoSlot];

    const hasClip = isWeaponWithClip(currentFirearm.value.key);

    /**
     * Make ammo easier to deal with.
     * If weapon has clip, the ammo in weapon clip is the clip ammo
     * and ammo in reserves is the rest.
     * Otherwise, we treat ammo in reserves as the clip ammo (for e.g. machinegun).
     */
    return {
      hasAmmoReserves: hasClip && equippedAmmo && equippedAmmo.amount > 0,
      clip: (hasClip ? currentFirearm.value.clip?.amount : equippedAmmo?.amount) ?? 0,
      rest: (hasClip ? equippedAmmo?.amount : 0) ?? 0,
    };
  });

  const weaponCanReload = computed(() => {
    // We don't have a firearm equipped
    if (!currentFirearm.value) {
      return false;
    }

    // We don't have any ammo
    if (!currentAmmo.value) {
      return false;
    }

    // We have a full clip
    if (currentAmmo.value.clip >= getItemInfoByKey(currentFirearm.value.key).clipSize) {
      return false;
    }

    if (!currentAmmo.value.hasAmmoReserves) {
      return false;
    }

    if (player.isReloading) {
      return false;
    }

    return true;
  });

  const stopWatchingAmmo = watchEffect(syncAmmo);

  const playerWeaponChangeListener = alt.Events.onPlayerWeaponChange(onPlayerWeaponChange);
  const keyDownListener = alt.Events.onKeyDown(handleManualReload);
  const playerWeaponShootListener = alt.Events.onPlayerWeaponShoot(onPlayerWeaponShoot);

  /**
   * Notify the server that the player has shot their weapon,
   * so we can update the current ammo in the clip.
   */
  function onPlayerWeaponShoot() {
    alt.Events.emitServerRaw(ServerEvents.FromClient.WEAPON_SHOOT);
  }

  /**
   * Sync the in-game ammo in the clip with ammo state in store when the player switches weapons.
   */
  function onPlayerWeaponChange() {
    if (!currentAmmo.value) {
      return;
    }

    syncAmmo();

    alt.Utils.waitFor(() => !game.isPedSwitchingWeapon(player), 3000)
      .then(() => alt.Utils.wait(1000))
      .finally(syncAmmo);
  }

  /**
   * Reloads the weapon when the player presses the reload key.
   */
  function handleManualReload({ key }: alt.Events.KeyUpDownEventParameters) {
    if (isTyping()) {
      return;
    }

    if (key === alt.Enums.KeyCode.MOUSE_RIGHT || key === alt.Enums.KeyCode.MOUSE_LEFT) {
      syncAmmo();
    }
  }

  function syncAmmo() {
    alt.log(`[syncAmmo]`);

    const clip = currentAmmo.value?.clip ?? 0;
    const rest = currentAmmo.value?.rest ?? 0;

    game.setPedAmmo(player, player.currentWeapon, clip + rest, true);
    game.setAmmoInClip(player, player.currentWeapon, clip);
  }

  let wasReloading = false;

  const reloadTrackingTick = alt.Timers.everyTick(() => {
    if (player.isReloading && !wasReloading) {
      wasReloading = true;
      rpc.callServer(ServerCall.FromClient.RELOAD_WEAPON).then(canReload => {
        if (!canReload) {
          game.clearPedTasksImmediately(player);
        }
      });
    }
    if (!player.isReloading && wasReloading) {
      wasReloading = false;
    }
  });

  return () => {
    playerWeaponChangeListener.destroy();
    keyDownListener.destroy();
    playerWeaponShootListener.destroy();
    reloadTrackingTick.destroy();
    stopWatchingAmmo();
    weaponCanReload.effect.stop();
    currentFirearm.effect.stop();
  };
});
