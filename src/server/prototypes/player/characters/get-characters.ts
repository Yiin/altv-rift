import { Player } from "@altv/server";
import { PrismaClient } from "@prisma/client";
import { container } from "@shared/dependency-injection";
import { Character } from "@shared/interfaces";
import { LoggedInPlayer } from "@/utility/assertions";

const prisma = container.get(PrismaClient);

declare module "@altv/server" {
  export interface Player {
    getCharacters(this: LoggedInPlayer): Promise<Character[]>;
  }
}

Player.prototype.getCharacters = function () {
  return prisma.character.findMany({
    where: {
      userId: this.user!.id,
    },
  }) as any as Promise<Character[]>;
};
