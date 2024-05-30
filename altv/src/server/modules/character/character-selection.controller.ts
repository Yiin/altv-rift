import alt from "@altv/server";
import { z } from "zod";
import { ClientEvents } from "@shared/events/client";
import { ServerCall } from "@shared/calls/server";
import { ServerEvents } from "@shared/events/server";
import { isUnique } from "@/core/validator";
import { rpc } from "@/core/rpc";
import { LoggedInPlayer, isLoggedIn, needsToBeLoggedIn } from "@/core/utility/assertions";
import { on } from "@/core/events/emit";
import { getDefaultCharacterData } from "./get-default-character-data";

on(ServerEvents.FromServer.USER_LOAD, (player) => {
  if (!isLoggedIn(player)) {
    return;
  }

  const charactersCount = player.user.characters.length;

  if (charactersCount === 0) {
    alt.Timers.nextTick(() => {
      // player.despawn();
      player.emitRaw(ClientEvents.FromServer.START_CHARACTER_CREATION_SCENE);
    });
    // Forward player to character creation scene because they have no characters
  } else {
    player.startGame(player.user.characters[0].id!);
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
  const name = await z
    .string()
    .min(2, "Character name must be at least 2 characters long")
    .max(20, "Character name must be no more than 20 characters long")
    .regex(/^[a-zA-Z]/, "Character name must start with a letter")
    .regex(/[a-zA-Z0-9 ]+$/, "Valid characters are a-z, A-Z, 0-9 and space")
    .and(isUnique("character", "name", "This name is already taken :("))
    .parseAsync(data.name);

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

  player.startGame(character.id);

  return true;
});

function canCreateNewCharacter(player: LoggedInPlayer) {
  if (player.user.characters.length > 0) {
    throw new Error("You already have a character.");
  }
}
