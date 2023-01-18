import { PrismaClient } from "@prisma/client";
import { container } from "@shared/ioc-container";
import { Player } from "alt-server";

const prisma = container.get(PrismaClient);

Player.prototype.getCharacters = function () {
  return prisma.character.findMany({
    where: {
      userId: this.user!.id,
    },
  });
};
