import * as alt from "@altv/server";
import { ClientEvents } from "@shared/events/client";
import { ServerCall } from "@shared/calls/server";
import { ServerEvents } from "@shared/events/server";
import { isValidItem } from "@shared/modules/items";
import { isRequired, isUnique, isValidCharacterName, validate } from "@/core/validator";
import { rpc } from "@/core/rpc";
import { LoggedInPlayer, isInGame, isLoggedIn, needsToBeLoggedIn } from "@/core/utility/assertions";
import { on } from "@/core/events/emit";
import { removeItemFromInventorySlot } from "../items-manager";
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

  await validate(data, {
    name: [
      isRequired("Please name your character"),
      isUnique("This name is already taken", {
        model: "character",
        field: "name",
      }),
      isValidCharacterName(),
    ],
    appearance: [isRequired("Please select an appearance")],
  });

  const { name, appearance } = data;

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
