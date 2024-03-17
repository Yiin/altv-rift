import { Player } from "@altv/server";
import { PrismaClient } from "@prisma/client";
import { container } from "@shared/dependency-injection";

const prisma = container.get(PrismaClient);

declare module "@altv/server" {
  export interface Player {
    createCharacter(
      this: Player,
      characterData: import("@prisma/client").Prisma.CharacterCreateInput,
    ): Promise<import("@prisma/client").Character>;
  }
}

Player.prototype.createCharacter = async function (characterData) {
  return prisma.character.create({
    data: characterData,
  });
};
