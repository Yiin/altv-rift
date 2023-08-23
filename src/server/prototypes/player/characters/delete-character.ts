import { Player } from "alt-server";
import { PrismaClient } from "@prisma/client";
import { container } from "@shared/dependency-injection";

const prisma = container.get(PrismaClient);

declare module "alt-server" {
  export interface Player {
    deleteCharacter(characterId: string): Promise<void>;
  }
}

Player.prototype.deleteCharacter = async function (characterId: string) {
  if (!this.store.isLoggedIn) return;

  await prisma.character.deleteMany({
    where: {
      id: characterId,
      userId: this.store.user.id,
    },
  });
};
