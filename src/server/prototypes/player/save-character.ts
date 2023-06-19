import { Player } from "alt-server";
import { PrismaClient } from "@prisma/client";
import { container } from "@shared/dependency-injection";

const prisma = container.get(PrismaClient);

declare module "alt-server" {
  export interface Player {
    saveCharacter(this: Player): Promise<void>;
  }
}

Player.prototype.saveCharacter = async function () {
  if (!this.store.isLoggedIn || !this.store.character) {
    return;
  }

  const { id, name, userId, inventory, ...data } = this.store.character;

  await prisma.character.update({
    where: {
      id,
    },
    data: {
      ...data,
      inventory,
      lastPosition: this.pos,
      rot: this.rot.z,
      health: this.health,
    },
  });
};
