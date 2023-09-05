import alt from "alt-client";
import game from "natives";
import { KeyCode } from "altv-enums";
import { watchEffect } from "vue";
import { ItemType } from "@prisma/client/edge";
import { ServerEvents } from "@shared/events/server";
import { ServerCall } from "@shared/calls/server";
import { getItemData, getWeaponHash } from "@shared/modules/items";
import { rpc } from "@/rpc";
import { useCharacter } from "@/store/character.store";

const player = alt.Player.local;

alt.on("gameStart", () => {
  alt.on("playerWeaponShoot", () => {
    alt.emitServerRaw(ServerEvents.FromClient.WEAPON_SHOOT);
  });

  alt.on("keydown", async (key) => {
    if (key === KeyCode.R) {
      startReloading();
    }
  });

  alt.on("playerWeaponChange", () => {
    updateAmmo();
  });

  watchEffect(() => {
    updateAmmo();
  });
});

function updateAmmo() {
  const character = useCharacter();
  const weapon = character?.equipment.weapon;

  if (!weapon) {
    return;
  }

  if (weapon.type !== ItemType.FIREARM_WEAPON) {
    return;
  }

  const weaponData = getItemData(weapon);

  const {
    clip: { amount: clip },
    rest: { amount: rest },
  } = weaponData.ammo ?? { clip: { amount: 0 }, rest: { amount: 0 } };

  const hash = getWeaponHash(weapon.key);

  const [, gameClip] = game.getAmmoInClip(player.scriptID, hash);

  if ((!gameClip && clip > 0) || gameClip > clip) {
    game.setAmmoInClip(player.scriptID, hash, clip);
  }
}

async function startReloading() {
  if (player.isReloading) {
    return;
  }

  const startReload = await rpc.callServer(ServerCall.FromClient.RELOAD_WEAPON);

  if (startReload) {
    game.taskReloadWeapon(player.scriptID, true);
  }
}
