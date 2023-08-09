import alt, { Player } from "alt-server";
import { ClientEvents } from "@shared/events/client";
import { ServerCall } from "@shared/calls/server";
import { isRequired, isUnique, validate } from "@/validator";
import { ServerEvent } from "@/constants/server-events";
import { rpc } from "@/rpc";

alt.on(ServerEvent.USER_LOADED, async (player: Player) => {
  if (!player.store.isLoggedIn) {
    return;
  }

  const charactersCount = player.store.user.characters.length;

  if (charactersCount === 0) {
    alt.log("triggering client (start character creation scene)");
    player.emitRaw(ClientEvents.FromServer.START_CHARACTER_CREATION_SCENE);
    // Forward player to character creation scene because they have no characters
  } else {
    startGame(player, player.store.user.characters[0].id!);
    // alt.log("triggering client (start character selection scene)");
    // void player.emitRaw(Events.Client.START_CHARACTER_SELECTION_SCENE);
    // Start character selection scene
  }
});

rpc.registerWebview(
  ServerCall.FromWebview.CREATE_CHARACTER,
  async (player, data) => {
    if (!player.store.isLoggedIn) {
      throw new Error("Unauthenticated.");
    }

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
        appearance: appearance,
        health: 100,
        user: {
          connect: {
            id: player.store.user.id,
          },
        },
        lastPosition: { x: 155, y: 6634.86, z: 31.62 },
        rot: 88.9,
        inventory: {
          set: {
            items: [],
            size: 25,
          },
        },
      });

      startGame(player, character.id);

      return true;
    } catch (e) {
      alt.logError(e);
      throw e;
    }
  }
);

async function startGame(player: Player, characterId: string) {
  if (!player.store.isLoggedIn) {
    return;
  }

  const character = await player.loadCharacter(characterId);

  if (!character) {
    return;
  }

  player.updateCharacterAppearance(character.appearance);

  player.spawn(
    character.lastPosition.x,
    character.lastPosition.y,
    character.lastPosition.z
  );
  player.rot = new alt.Vector3(character.rot);
  player.health = Math.max(character.health, 200);
  player.dimension = 0;

  player.emit(ClientEvents.FromServer.START_GAME);
  player.hasFullySpawned = true;
}
