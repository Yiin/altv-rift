import { Player } from "alt-server";
import { PrismaClient, User } from "@prisma/client";
import { container } from "@shared/ioc-container";

const prisma = container.get(PrismaClient);

declare module "alt-server" {
  export interface Player {
    loadUser(this: Player, user: LoadedUser): Promise<LoadedUser | null>;
    loadUser(this: Player, discordId: string): Promise<LoadedUser | null>;
  }
}

Player.prototype.loadUser = async function (
  discordIdOrUser: string | LoadedUser
) {
  this.store.isLoggedIn = true;

  // TypeScript is dumb and doesn't know that this.store.isLoggedIn is true
  if (!this.store.isLoggedIn) {
    throw new Error(); // never
  }

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
