import { PrismaClient } from "@prisma/client";
import { container } from "@shared/ioc-container";
import { Player } from "alt-server";

const prisma = container.get(PrismaClient);

Player.prototype.createCharacter = async function (characterData) {
  return prisma.character.create({
    data: characterData,
  });
};
