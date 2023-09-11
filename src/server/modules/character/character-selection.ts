import alt from "@altv/server";
import { ClientEvents } from "@shared/events/client";
import { ServerCall } from "@shared/calls/server";
import { ServerEvents } from "@shared/events/server";
import { isRequired, isUnique, validate } from "@/validator";
import { rpc } from "@/rpc";
import { LoggedInPlayer, isLoggedIn, needsToBeLoggedIn } from "@/utility/assertions";
import { getDefaultCharacterData } from "./character-data";

alt.Events.on(ServerEvents.FromServer.USER_LOADED, async (player) => {
  if (!isLoggedIn(player)) {
    return;
  }

  const charactersCount = player.user.characters.length;

  if (charactersCount === 0) {
    alt.log("triggering client (start character creation scene)");
    player.emit(ClientEvents.FromServer.START_CHARACTER_CREATION_SCENE);
    // Forward player to character creation scene because they have no characters
  } else {
    startGame(player, player.user.characters[0].id!);
    // alt.log("triggering client (start character selection scene)");
    // void player.emit(Events.Client.START_CHARACTER_SELECTION_SCENE);
    // Start character selection scene
  }
});

rpc.registerWebview(ServerCall.FromWebview.CREATE_CHARACTER, async (player, data) => {
  needsToBeLoggedIn(player);

  await validate(data, {
    name: [
      isRequired("Please name your character"),
      isUnique("This name is already taken", {
        model: "character",
        field: "name",
      }),
    ],
  });

  const { name, appearance } = data;

  try {
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
  } catch (e) {
    alt.logError(e);
    throw e;
  }
});

async function startGame(player: LoggedInPlayer, characterId: string) {
  const character = await player.loadCharacter(characterId);

  if (!character) {
    return;
  }

  player.setupCharacterStore(character);

  player.updateCharacterAppearance(character.appearance);

  player.spawn(character.lastPosition);
  player.rot = new alt.Vector3(character.rot);
  player.health = Math.max(character.health, 200);
  player.dimension = 0;

  player.emit(ClientEvents.FromServer.START_GAME);
}
