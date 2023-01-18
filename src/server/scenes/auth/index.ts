import alt from "alt-server";
import { PrismaClient } from "@prisma/client";
import { bind } from "@shared/decorators";
import { inject } from "inversify";
import { handleEvent } from "@/decorators";

@bind()
export class AuthModule {
  constructor(@inject(PrismaClient) private readonly prisma: PrismaClient) {}

  @handleEvent("playerConnect")
  onPlayerConnect(player: alt.Player) {
    alt.emit("discord:BeginAuth", player);
  }

  @handleEvent("discord:AuthDone")
  async onDiscordAuthDone(player: alt.Player, discordInfo: any) {
    alt.log("onDiscordAuthDone");
    alt.log(discordInfo);

    const user = await this.prisma.user.upsert({
      where: {
        discordId: discordInfo.id,
      },
      create: {
        username: discordInfo.username,
        discordId: discordInfo.id,
      },
      update: {
        username: discordInfo.username,
      },
      include: {
        characters: true,
      },
    });

    await player.loadUser(user);
    alt.emit("user:Loaded", player);
  }
}
