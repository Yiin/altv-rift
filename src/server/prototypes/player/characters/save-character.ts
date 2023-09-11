import { Player } from "@altv/server";
import { PrismaClient } from "@prisma/client";
import { container } from "@shared/dependency-injection";
import { InGamePlayer } from "@/utility/assertions";

const prisma = container.get(PrismaClient);

declare module "@altv/server" {
  export interface Player {
    saveCharacter(this: InGamePlayer): Promise<void>;
  }
}

Player.prototype.saveCharacter = async function () {
  const { id, name, userId, equipment, ...data } = this.character.$state;

  await prisma.character.update({
    where: {
      id,
    },
    data: {
      ...data,
      equipment: {
        set: equipment,
      },
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
