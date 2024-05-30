import { Player } from "@altv/server";
import { PrismaClient } from "@prisma/client";
import { container } from "@shared/dependency-injection";
import { LoggedInPlayer } from "@/core/utility/assertions";

const prisma = container.get(PrismaClient);

declare module "@altv/server" {
  export interface Player {
    deleteCharacter(this: LoggedInPlayer, characterId: string): Promise<void>;
  }
}

Player.prototype.deleteCharacter = async function (characterId: string) {
  await prisma.character.deleteMany({
    where: {
      id: characterId,
      userId: this.user.id,
    },
  });
};
