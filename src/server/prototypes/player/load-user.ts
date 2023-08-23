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
  this.store.isLoggedIn = true;

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
      this.store.user = user;
    }

    return user;
  }

  this.store.user = discordIdOrUser;
  return discordIdOrUser;
};
