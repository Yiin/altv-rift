import { Player } from "alt-server";
import { PrismaClient } from "@prisma/client";
import { container } from "@shared/dependency-injection";
import { Character } from "@shared/interfaces";

const prisma = container.get(PrismaClient);

declare module "alt-server" {
  export interface Player {
    getCharacters(): Promise<Character[]>;
  }
}

Player.prototype.getCharacters = function () {
  if (!this.store.isLoggedIn) return Promise.resolve([]);

  return prisma.character.findMany({
    where: {
      userId: this.store.user!.id,
    },
  }) as Promise<Character[]>;
};
