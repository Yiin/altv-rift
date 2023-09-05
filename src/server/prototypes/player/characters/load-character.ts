import { Player } from "alt-server";
import { PrismaClient } from "@prisma/client";
import { container } from "@shared/dependency-injection";
import { Character } from "@shared/interfaces";
import { LoggedInPlayer } from "@/utility/assertions";

const prisma = container.get(PrismaClient);

declare module "alt-server" {
  export interface Player {
    loadCharacter(this: LoggedInPlayer, characterId: string): Promise<Character | null>;
  }
}

Player.prototype.loadCharacter = async function (characterId: string) {
  const character = (await prisma.character.findFirst({
    where: {
      id: characterId,
      userId: this.user!.id,
    },
  })) as Character | null;

  if (!character) {
    return null;
  }

  return character;
};
