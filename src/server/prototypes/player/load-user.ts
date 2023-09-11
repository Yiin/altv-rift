import { Player } from "@altv/server";
import { PrismaClient } from "@prisma/client";
import { container } from "@shared/dependency-injection";
import { User } from "@shared/interfaces";

const prisma = container.get(PrismaClient);

declare module "@altv/server" {
  export interface Player {
    loadUser(user: User): Promise<User | null>;
    loadUser(discordId: string): Promise<User | null>;
  }
}

Player.prototype.loadUser = async function (discordIdOrUser: string | User) {
  if (typeof discordIdOrUser === "string") {
    const user = (await prisma.user.findFirst({
      where: {
        discordId: discordIdOrUser,
      },
      include: {
        characters: true,
      },
    })) as User;

    if (user) {
      this.setupUserStore(user);
    }

    return user;
  }

  this.setupUserStore(discordIdOrUser);

  return discordIdOrUser;
};
