import { Player } from "alt-server";
import { PrismaClient } from "@prisma/client";
import { container } from "@shared/dependency-injection";
import { Character } from "@shared/interfaces";

const prisma = container.get(PrismaClient);

declare module "alt-server" {
  export interface Player {
    loadCharacter(this: Player, characterId: string): Promise<Character | null>;
  }
}

Player.prototype.loadCharacter = async function (characterId: string) {
  if (!this.store.isLoggedIn) {
    throw new Error("Unauthenticated.");
  }

  const character = (await prisma.character.findFirst({
    where: {
      id: characterId,
      userId: this.store.user!.id,
    },
  })) as Character | null;

  if (!character) {
    return null;
  }

  this.store.character = character;

  return character;
};
