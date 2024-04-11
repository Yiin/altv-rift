import alt from "@altv/server";
import { z } from "zod";
import { ClientEvents } from "@shared/events/client";
import { ServerCall } from "@shared/calls/server";
import { ServerEvents } from "@shared/events/server";
import { isValidItem } from "@shared/modules/items";
import { removeItemFromInventorySlot } from "@shared/modules/inventory";
import { isUnique } from "@/core/validator";
import { rpc } from "@/core/rpc";
import { LoggedInPlayer, isInGame, isLoggedIn, needsToBeLoggedIn } from "@/core/utility/assertions";
import { on } from "@/core/events/emit";
import { getDefaultCharacterData } from "./character-data";

on(ServerEvents.FromServer.USER_LOAD, (player) => {
  if (!isLoggedIn(player)) {
    return;
  }

  const charactersCount = player.user.characters.length;

  if (charactersCount === 0) {
    alt.log("triggering client (start character creation scene)");
    alt.Timers.nextTick(() => {
      // player.despawn();
      player.emitRaw(ClientEvents.FromServer.START_CHARACTER_CREATION_SCENE);
    });
    // Forward player to character creation scene because they have no characters
  } else {
    startGame(player, player.user.characters[0].id!);
    // alt.log("triggering client (start character selection scene)");
    // void player.emitRaw(Events.Client.START_CHARACTER_SELECTION_SCENE);
    // Start character selection scene
  }
});

rpc.registerWebview(ServerCall.FromWebview.CREATE_CHARACTER, async (player, data) => {
  needsToBeLoggedIn(player);
  canCreateNewCharacter(player);

  const { appearance } = data;

  /**
   * More comprehensive validation of the character name.
   */
  const name = z
    .string()
    .min(2, "Character name must be at least 2 characters long")
    .max(20, "Character name must be no more than 20 characters long")
    .regex(/^[a-zA-Z]/, "Character name must start with a letter")
    .regex(/[a-zA-Z0-9 ]+$/, "Valid characters are a-z, A-Z, 0-9 and space")
    .and(isUnique("character", "name", "This name is already taken :("))
    .parse(data.name);

  const character = await player.createCharacter({
    name,
    appearance,
    user: {
      connect: {
        id: player.user.id,
      },
    },
    ...getDefaultCharacterData(),
  });

  startGame(player, character.id);

  return true;
});

async function startGame(player: LoggedInPlayer, characterId: string) {
  const character = await player.loadCharacter(characterId);

  if (!character) {
    return;
  }

  player.setupCharacterStore(character);

  player.updateCharacterAppearance(character.appearance);

  if (isInGame(player)) {
    player.character.inventory.items
      .filter(({ item }) => !isValidItem(item.key))
      .forEach(({ slot }) => {
        removeItemFromInventorySlot(player.character.inventory, slot);
      });
  }

  player.spawn(character.lastPosition);
  player.rot = new alt.Vector3(character.rot);
  player.maxHealth = Math.max(character.health, 2000);
  player.health = Math.max(character.health, 2000);
  player.dimension = 0;

  player.emitRaw(ClientEvents.FromServer.START_GAME);
}

export function canCreateNewCharacter(player: LoggedInPlayer) {
  if (player.user.characters.length > 0) {
    throw new Error("You already have a character.");
  }
}
