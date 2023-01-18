import { Player } from "alt-server";
import { PrismaClient } from "@prisma/client";
import { container } from "@shared/ioc-container";

const prisma = container.get(PrismaClient);

Player.prototype.deleteCharacter = async function (characterId: string) {
  await prisma.character.deleteMany({
    where: {
      id: characterId,
      userId: this.user!.id,
    },
  });
};
