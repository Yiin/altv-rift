import { PrismaClient } from "@prisma/client";
import { container } from "@shared/ioc-container";
import { Player } from "alt-server";

const prisma = container.get(PrismaClient);

Player.prototype.loadCharacter = async function (characterId: string) {
  const character = await prisma.character.findFirst({
    where: {
      id: characterId,
      userId: this.user!.id,
    },
  });

  if (character) {
    this.character = character;
  }

  return character;
};
