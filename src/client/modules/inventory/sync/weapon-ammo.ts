import alt from "@altv/client";
import game from "@altv/natives";
import { computed, watchEffect } from "vue";
import { ServerEvents } from "@shared/events/server";
import { ServerCall } from "@shared/calls/server";
import { getItemInfoByKey } from "@shared/modules/items";
import { isItemFirearmWeapon } from "@shared/modules/items/registry/weapons/firearm-weapon.items";
import { rpc } from "@/core/rpc";
import { useCharacter } from "@/core/store/character.store";
import { Control, ControlType } from "@/core/constants/controls";
import { whileInGame } from "@/core/game-state-hooks/in-game.state";

const player = alt.Player.local;

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

  const weaponCanReload = computed(() => {
    // We don't have a firearm equipped
    if (!currentFirearm.value) {
      return false;
    }

    // We don't have any ammo
    if (!currentFirearm.value?.ammo) {
      return false;
    }

    // We have a full clip
    if (currentFirearm.value.ammo.clip >= getItemInfoByKey(currentFirearm.value.key).clipSize) {
      return false;
    }

    if (player.isReloading) {
      return false;
    }

    return true;
  });

  const stopWatchingAmmo = watchEffect(handleAmmoChange);

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
    if (!currentFirearm.value) {
      return;
    }

    if (!currentFirearm.value.ammo) {
      return;
    }

    if (currentFirearm.value.ammo.clip > 0) {
      allowShooting();
    }

    alt.Utils.waitFor(
      () => !game.isPedSwitchingWeapon(player),
      3000
    ).then(() => alt.Utils.wait(1000)).finally(handleAmmoChange);
  }

  /**
   * Reloads the weapon when the player presses the reload key.
   */
  function handleManualReload({ key }: alt.Events.KeyUpDownEventParameters) {
    if (key === alt.Enums.KeyCode.R) {
      reloadWeapon();
    }
  }

  /**
   * Reloads the weapon if the clip is empty.
   */
  function handleAmmoChange() {
    const weapon = currentFirearm?.value;

    if (!weapon) {
      return;
    }

    const { clip, rest } = weapon.ammo ?? { clip: 0, rest: 0 };

    if (clip > 0) {
      allowShooting();
    } else if (rest > 0) {
      reloadWeapon();
    } else {
      disableShooting();
    }
  }

  /**
   * Tries to reload the weapon.
   */
  async function reloadWeapon() {
    if (!weaponCanReload.value) {
      return;
    }

    const disableMeleeAttackLight_R = alt.Timers.everyTick(() => {
      game.disableControlAction(ControlType.PLAYER_CONTROL, Control.INPUT_MELEE_ATTACK_LIGHT, true);
      game.disableControlAction(ControlType.PLAYER_CONTROL, Control.INPUT_MELEE_ATTACK_HEAVY, true);
      game.disableControlAction(ControlType.PLAYER_CONTROL, Control.INPUT_MELEE_ATTACK_ALTERNATE, true);
    });

    try {
      const startReload = await rpc.callServer(ServerCall.FromClient.RELOAD_WEAPON);

      if (startReload) {
        game.taskReloadWeapon(player, true);
      }

      await alt.Utils.waitFor(() => !player.isReloading);
    } finally {
      disableMeleeAttackLight_R.destroy();
    }
  }

  function allowShooting() {
    // Setting 1 ammo in clip because infinite ammo
    // doesn't do anything if there is no ammo in clip
    game.setAmmoInClip(player, player.currentWeapon, 1);
    game.setPedInfiniteAmmoClip(player, true);
  }

  function disableShooting() {
    if (player.isReloading) {
      game.clearPedTasksImmediately(player);
    }
    game.setAmmoInClip(player, player.currentWeapon, 0);
    game.setPedInfiniteAmmoClip(player, false);
  }

  return () => {
    playerWeaponChangeListener.destroy();
    keyDownListener.destroy();
    playerWeaponShootListener.destroy();
    stopWatchingAmmo();
    weaponCanReload.effect.stop();
    currentFirearm.effect.stop();
  };
});
