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
  if (!this.store.isLoggedIn) {
    return;
  }

  const { id, name, userId, ...data } = this.store.character;

  await prisma.character.update({
    where: {
      id,
    },
    data: {
      ...data,
      lastPosition: {
        x: this.pos.x,
        y: this.pos.y,
        z: this.pos.z,
      },
      rot: this.rot.z,
      health: this.health,
    },
  });
};
