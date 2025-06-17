import alt from "@altv/server";
import { ClientEvents } from "@shared/events/client";
import { removeItemFromInventorySlot } from "@shared/modules/inventory";
import {
  getWeaponAmmoType,
  getWeaponData,
  isItemFirearmWeapon,
  isValidItem,
} from "@shared/modules/items";
import { LoggedInPlayer, isInGame } from "@/core/utility/assertions";
import { watch } from "@yiin/reactive-proxy-state";

declare module "@altv/server" {
  export interface Player {
    startGame: (this: LoggedInPlayer, characterId: string) => void;
  }
}

alt.Player.prototype.startGame = async function (characterId: string) {
  const character = await this.loadCharacter(characterId);

  if (!character) {
    return;
  }

  this.setupCharacterStore(character);

  if (!isInGame(this)) {
    return;
  }

  this.character.inventory.items
    .filter(({ item }) => !isValidItem(item.key))
    .forEach(({ slot }) => {
      removeItemFromInventorySlot(this.character.inventory, slot);
    });
  this.updateCharacterAppearance(character.appearance);

  watch(
    () => this.character.equipment.weapon,
    (weapon) => {
      if (!weapon) {
        return;
      }
      if (!isItemFirearmWeapon(weapon)) {
        return;
      }

      const ammoType = getWeaponAmmoType(weapon.key);

      if (ammoType) {
        if (weapon.clip?.key.startsWith("explosive")) {
          if (this.getAmmoSpecialType(alt.hash(ammoType)) !== alt.Enums.AmmoSpecialType.EXPLOSIVE) {
            alt.log(
              `Setting explosive ammo for ${weapon.key}, current ammo: ${alt.hash(ammoType)}, weapon: ${this.currentWeapon}`,
            );

            this.setAmmoSpecialType(alt.hash(ammoType), alt.Enums.AmmoSpecialType.EXPLOSIVE);
          }
        } else {
          alt.log(`Setting none ammo for ${weapon.key}`);
          this.setAmmoSpecialType(alt.hash(ammoType), alt.Enums.AmmoSpecialType.NONE);
        }
      } else {
        alt.log(`No ammo for ${weapon.key}`);
      }
    },
    { deep: true },
  );

  this.spawn(character.lastPosition);
  this.rot = new alt.Vector3(character.rot);
  this.maxHealth = Math.max(character.health, 2000);
  this.health = Math.max(character.health, 2000);
  this.dimension = 0;

  this.emitRaw(ClientEvents.FromServer.START_GAME);
};
