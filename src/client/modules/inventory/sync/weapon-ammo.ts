import alt from "alt-client";
import game from "natives";
import { KeyCode } from "altv-enums";
import { computed, watchEffect } from "vue";
import { ServerEvents } from "@shared/events/server";
import { ServerCall } from "@shared/calls/server";
import { getItemInfoByKey, getWeaponHash } from "@shared/modules/items";
import { isItemFirearmWeapon } from "@shared/modules/items/registry/weapons/firearm-weapon.items";
import { rpc } from "@/core/rpc";
import { useCharacter } from "@/core/store/character.store";
import { Control, ControlType } from "@/core/constants/controls";
import { whileInGame } from "@/core/game-state/in-game.state";

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

    return true;
  });

  const stopWatchingAmmo = watchEffect(updateAmmo);

  alt.on("playerWeaponChange", onPlayerWeaponChange);
  alt.on("keydown", handleManualReload);
  alt.on("playerWeaponShoot", onPlayerWeaponShoot);

  /**
   * Notify the server that the player has shot their weapon,
   * so we can update the current ammo in the clip.
   */
  function onPlayerWeaponShoot() {
    alt.emitServerRaw(ServerEvents.FromClient.WEAPON_SHOOT);
  }

  /**
   * Sync the in-game ammo in the clip with ammo state in store when the player switches weapons.
   */
  function onPlayerWeaponChange() {
    alt.Utils.waitFor(
      () =>
        !game.isPedSwitchingWeapon(player) && game.getAmmoInClip(player, player.currentWeapon)[0] // [hasClip, ammoInClip]
    ).finally(updateAmmo);
  }

  /**
   * Reloads the weapon when the player presses the reload key.
   */
  function handleManualReload(key: KeyCode) {
    if (key === KeyCode.R) {
      reloadWeapon();
    }
  }

  /**
   * Updates the ammo in the clip for weapon in-game based on current ammo state in the store.
   */
  function updateAmmo() {
    const weapon = currentFirearm?.value;

    if (!weapon) {
      return;
    }

    const { clip } = weapon.ammo ?? { clip: 0 };

    const hash = getWeaponHash(weapon.key);

    const [, gameClip] = game.getAmmoInClip(player, hash);

    if ((gameClip <= 3 && clip > 0) || gameClip > clip) {
      game.setAmmoInClip(player, hash, clip);
    }
  }

  /**
   * Tries to reload the weapon.
   */
  async function reloadWeapon() {
    if (player.isReloading) {
      return;
    }

    if (!weaponCanReload.value) {
      return;
    }

    const disableMeleeAttackLight_R = alt.everyTick(() => {
      game.disableControlAction(
        ControlType.PLAYER_CONTROL,
        Control.INPUT_MELEE_ATTACK_LIGHT,
        false
      );
    });

    try {
      const startReload = await rpc.callServer(ServerCall.FromClient.RELOAD_WEAPON);

      if (startReload) {
        game.taskReloadWeapon(player, true);
      }

      await alt.Utils.waitFor(() => !player.isReloading);
    } finally {
      alt.clearEveryTick(disableMeleeAttackLight_R);
    }
  }

  return () => {
    alt.off("playerWeaponShoot", onPlayerWeaponShoot);
    alt.off("playerWeaponChange", onPlayerWeaponChange);
    alt.off("keydown", handleManualReload);
    stopWatchingAmmo();
    weaponCanReload.effect.stop();
    currentFirearm.effect.stop();
  };
});
