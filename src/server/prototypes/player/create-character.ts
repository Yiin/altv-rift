import { Player } from "alt-server";
import { PrismaClient } from "@prisma/client";
import { container } from "@shared/dependency-injection";

const prisma = container.get(PrismaClient);

declare module "alt-server" {
  export interface Player {
    createCharacter(
      this: Player,
      characterData: import("@prisma/client").Prisma.CharacterCreateInput
    ): Promise<import("@prisma/client").Character>;
  }
}

Player.prototype.createCharacter = async function (characterData) {
  return prisma.character.create({
    data: characterData,
  });
};
