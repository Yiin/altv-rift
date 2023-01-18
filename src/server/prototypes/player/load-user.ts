import { PrismaClient, User } from "@prisma/client";
import { container } from "@shared/ioc-container";
import { Player } from "alt-server";

const prisma = container.get(PrismaClient);

Player.prototype.loadUser = async function (
  discordIdOrUser: string | LoadedUser
) {
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
      this.user = user;
    }

    return user;
  }

  this.user = discordIdOrUser;
  return discordIdOrUser;
};
