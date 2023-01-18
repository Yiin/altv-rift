import alt, { Player } from "alt-server";
import { inject } from "inversify";
import rpc from "altv-rpc";
import { type Appearance, PrismaClient } from "@prisma/client";
import { RPC } from "@shared/constants/rpcs";
import { bind } from "@shared/decorators";
import { isRequired, isUnique, validate } from "@/utils/validator";
import { handleEvent, registerRpc } from "@/decorators";

@bind()
export default class CharacterSelectionModule {
  constructor(
    @inject(PrismaClient)
    private readonly prisma: PrismaClient
  ) {}

  @handleEvent("user:Loaded")
  async onUserLoaded(player: Player) {
    const charactersCount = player.user?.characters.length || 0;

    if (charactersCount === 0) {
      void rpc.triggerClient(player, RPC.Client.START_CHARACTER_CREATION_SCENE);
      // Forward player to character creation scene because they have no characters
    } else {
      void rpc.triggerClient(
        player,
        RPC.Client.START_CHARACTER_SELECTION_SCENE
      );
      // Start character selection scene
    }
  }

  @registerRpc(RPC.Server.CREATE_CHARACTER)
  async createCharacter(
    data: { name: string; appearance: Appearance },
    info: ServerProcedureListenerInfo
  ) {
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

    await info.player.createCharacter({
      name,
      appearance,
      health: 100,
      user: {
        connect: {
          id: info.player.user!.id,
        },
      },
      lastPosition: { x: 155, y: 6634.86, z: 31.62 },
      rot: 88.9,
    });
  }

  @registerRpc(RPC.Server.START_GAME)
  async startGame(characterId: string, info: ServerProcedureListenerInfo) {
    const character = await info.player.loadCharacter(characterId);

    if (!character) {
      alt.log("Character wasn't found");
      return;
    }

    info.player.updateCharacterAppearance(character.appearance);

    info.player.spawn(
      character.lastPosition.x,
      character.lastPosition.y,
      character.lastPosition.z
    );
    info.player.rot = new alt.Vector3(character.rot);
    info.player.health = character.health;
  }
}
