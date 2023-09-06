import alt from "alt-client";
import game from "natives";
import { KeyCode } from "altv-enums";
import { computed, watchEffect } from "vue";
import { ItemType } from "@prisma/client/edge";
import { ServerEvents } from "@shared/events/server";
import { ServerCall } from "@shared/calls/server";
import { getItemData, getItemInfoByKey, getWeaponHash } from "@shared/modules/items";
import { rpc } from "@/rpc";
import { useCharacter } from "@/store/character.store";
import { Control, ControlType } from "@/constants/controls";
import { whileInGame } from "@/core/game-state/in-game.state";

const player = alt.Player.local;

whileInGame(() => {
  const currentFirearm = computed(getCurrentFirearm);
  const weaponCanReload = computed(getCanWeaponReload);

  const ammoWatchStopHandle = watchEffect(updateAmmo);

  alt.on("playerWeaponShoot", onPlayerWeaponShoot);
  alt.on("playerWeaponChange", onPlayerWeaponChange);
  alt.on("keydown", onKeyDown);

  function getCurrentFirearm() {
    const character = useCharacter();
    const weapon = character.equipment.weapon;

    if (!weapon) {
      return null;
    }

    if (weapon.type !== ItemType.FIREARM_WEAPON) {
      return null;
    }

    return weapon;
  }

  function getCanWeaponReload() {
    // We don't have a firearm equipped
    if (!currentFirearm.value) {
      return false;
    }

    // We don't have any ammo
    if (!currentFirearm.value.FIREARM_WEAPON?.ammo) {
      return false;
    }

    // We have a full clip
    if (
      currentFirearm.value.FIREARM_WEAPON.ammo.clip.amount >=
      getItemInfoByKey(currentFirearm.value.key).clipSize
    ) {
      return false;
    }

    return true;
  }

  function onPlayerWeaponShoot() {
    alt.emitServerRaw(ServerEvents.FromClient.WEAPON_SHOOT);
  }

  function onPlayerWeaponChange() {
    alt.Utils.waitFor(
      () =>
        !game.isPedSwitchingWeapon(player.scriptID) &&
        game.getAmmoInClip(player.scriptID, player.currentWeapon)[0]
    ).finally(updateAmmo);
  }

  function onKeyDown(key: KeyCode) {
    if (key === KeyCode.R) {
      tryReloadWeapon();
    }
  }

  function updateAmmo() {
    const weapon = currentFirearm?.value;

    if (!weapon) {
      return;
    }

    const weaponData = getItemData(weapon);

    const {
      clip: { amount: clip },
    } = weaponData.ammo ?? { clip: { amount: 0 } };

    const hash = getWeaponHash(weapon.key);

    const [, gameClip] = game.getAmmoInClip(player.scriptID, hash);

    if ((gameClip <= 3 && clip > 0) || gameClip > clip) {
      game.setAmmoInClip(player.scriptID, hash, clip);
    }
  }

  async function tryReloadWeapon() {
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
        game.taskReloadWeapon(player.scriptID, true);
      }

      await alt.Utils.waitFor(() => !player.isReloading);
    } finally {
      alt.clearEveryTick(disableMeleeAttackLight_R);
    }
  }

  return () => {
    alt.off("keydown", onKeyDown);
    alt.off("playerWeaponChange", onPlayerWeaponChange);
    alt.off("playerWeaponShoot", onPlayerWeaponShoot);
    ammoWatchStopHandle();
    weaponCanReload.effect.stop();
    currentFirearm.effect.stop();
  };
});
