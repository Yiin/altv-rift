import alt from "alt-server";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { inject } from "inversify";
import { bind } from "@shared/decorators";
import { Events } from "@shared/constants/events";
import { on, onClient } from "@/decorators";
import { ServerEvent } from "@/constants/server-events";

@bind()
export class DiscordAuthModule {
  constructor(@inject(PrismaClient) private readonly prisma: PrismaClient) {}

  @on("playerConnect")
  onPlayerConnect(player: alt.Player) {
    player.dimension = player.id + 1;
    player.setup();
  }

  /**
   * When a player joins a server, we need to wait for them to
   * setup their game before we can continue with the auth process.
   *
   * BEGIN_CONNECTION event is fired when the player is ready to
   * receive data from the server.
   */
  @onClient(Events.Server.BEGIN_CONNECTION)
  onBeginConnection(player: alt.Player) {
    if (player.store?.isLoggedIn) {
      player.kick("Questionable activity. (onBeginConnection)");
      throw new Error("Unauthenticated.");
    }

    player.emitRaw(Events.Client.DISCORD_BEGIN_AUTH);
  }

  /**
   * When the player has finished the discord auth process,
   * we can continue with the rest of the auth process.
   */
  @onClient(Events.Server.DISCORD_AUTH_DONE)
  async onDiscordAuthDone(player: alt.Player, token: string) {
    if (player.store.isLoggedIn) {
      player.kick("Questionable activity. (onDiscordAuthDone)");
      return;
    }

    const discordInfo = await this.getDiscordInfo(token);

    if (!discordInfo) {
      player.kick("Authorization failed");
      return;
    }

    alt.logDebug(`${discordInfo.username}#${discordInfo.discriminator}`);

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

    alt.emit(ServerEvent.USER_LOADED, player);
  }

  private async getDiscordInfo(token: string) {
    const request = await axios
      .get("https://discordapp.com/api/users/@me", {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${token}`,
        },
      })
      .catch(() => null);

    // Check if the request was successful and if the neccessary properties are included
    if (
      !request ||
      !request.data ||
      !request.data.id ||
      !request.data.username
    ) {
      return null;
    }

    return request.data;
  }
}
