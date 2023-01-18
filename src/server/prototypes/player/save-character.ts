import { PrismaClient } from "@prisma/client";
import { container } from "@shared/ioc-container";
import { Player } from "alt-server";

const prisma = container.get(PrismaClient);

Player.prototype.saveCharacter = async function () {
  await prisma.character.upsert({
    where: {
      id: this.character!.id,
    },
    update: {
      ...this.character,
    },
    create: {
      ...this.character!,
    },
  });
};
