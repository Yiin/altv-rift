import alt, { Player } from "alt-server";
import { type Appearance } from "@prisma/client";
import { bind } from "@shared/decorators";
import { Events } from "@shared/constants/events";
import { RPC } from "@shared/constants/rpcs";
import { isRequired, isUnique, validate } from "@/validator";
import { on, clientRpc } from "@/decorators";
import { onClient } from "@/decorators/on-client";
import { ServerEvent } from "@/constants/server-events";

@bind()
export default class CharacterSelectionModule {
  @on(ServerEvent.USER_LOADED)
  async onUserLoaded(player: Player) {
    if (!player.store.isLoggedIn) {
      throw new Error("Unauthenticated.");
    }

    const charactersCount = player.store.user.characters.length;

    if (charactersCount === 0) {
      alt.log("triggering client (start character creation scene)");
      player.emitRaw(Events.Client.START_CHARACTER_CREATION_SCENE);
      // Forward player to character creation scene because they have no characters
    } else {
      this.startGame(player, player.store.user.characters[0].id!);
      // alt.log("triggering client (start character selection scene)");
      // void player.emitRaw(Events.Client.START_CHARACTER_SELECTION_SCENE);
      // Start character selection scene
    }
  }

  @clientRpc(RPC.Server.CREATE_CHARACTER)
  async createCharacter(
    player: Player,
    data: { name: string; appearance: Appearance }
  ) {
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
            size: 10,
          },
        },
      });

      return character.id;
    } catch (e) {
      alt.logError(e);
      throw e;
    }
  }

  @onClient(Events.Server.START_GAME)
  async startGame(player: Player, characterId: string) {
    if (!player.store.isLoggedIn) {
      throw new Error("Unauthenticated.");
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

    player.emit(Events.Client.START_GAME);
    player.hasFullySpawned = true;
  }
}
