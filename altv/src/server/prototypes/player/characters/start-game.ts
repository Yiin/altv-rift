import alt from "@altv/server";
import { ClientEvents } from "@shared/events/client";
import { removeItemFromInventorySlot } from "@shared/modules/inventory";
import { isValidItem } from "@shared/modules/items";
import { LoggedInPlayer, isInGame } from "@/core/utility/assertions";

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

  if (isInGame(this)) {
    this.character.inventory.items
      .filter(({ item }) => !isValidItem(item.key))
      .forEach(({ slot }) => {
        removeItemFromInventorySlot(this.character.inventory, slot);
      });
    this.updateCharacterAppearance(character.appearance);
  }

  this.spawn(character.lastPosition);
  this.rot = new alt.Vector3(character.rot);
  this.maxHealth = Math.max(character.health, 2000);
  this.health = Math.max(character.health, 2000);
  this.dimension = 0;

  this.emitRaw(ClientEvents.FromServer.START_GAME);
};
