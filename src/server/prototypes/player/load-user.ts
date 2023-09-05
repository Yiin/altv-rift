import { Player } from "alt-server";
import { PrismaClient } from "@prisma/client";
import { container } from "@shared/dependency-injection";

const prisma = container.get(PrismaClient);

declare module "alt-server" {
  export interface Player {
    loadUser(user: LoadedUser): Promise<LoadedUser | null>;
    loadUser(discordId: string): Promise<LoadedUser | null>;
  }
}

Player.prototype.loadUser = async function (discordIdOrUser: string | LoadedUser) {
  if (typeof discordIdOrUser === "string") {
    const user = await prisma.user.findFirst({
      where: {
        discordId: discordIdOrUser,
      },
      include: {
        characters: true,
      },
    });

    if (user) {
      this.setupUserStore(user);
    }

    return user;
  }

  this.setupUserStore(discordIdOrUser);

  return discordIdOrUser;
};
