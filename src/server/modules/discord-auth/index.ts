import alt from "alt-server";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { inject } from "inversify";
import { bind } from "@shared/decorators";
import { ServerEvents } from "@shared/events/server";
import { ClientEvents } from "@shared/events/client";
import { on, onClient } from "@/decorators";
import { ServerEvent } from "@/constants/server-events";
import { checkForQuestionableActivity } from "@/utility/questionable-activity";
import { beginManualDiscordAuth } from "./verify";
import "./webserver";

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
  @onClient(ServerEvents.FromClient.BEGIN_CONNECTION)
  onBeginConnection(player: alt.Player) {
    checkForQuestionableActivity(
      player,
      player.store.isLoggedIn,
      "onBeginConnection"
    );

    player.emitRaw(ClientEvents.FromServer.BEGIN_NATIVE_DISCORD_AUTH);
  }

  @onClient(ServerEvents.FromClient.MANUAL_DISCORD_AUTH)
  async onManualDiscordAuth(player: alt.Player) {
    checkForQuestionableActivity(
      player,
      player.store.isLoggedIn,
      "onManualDiscordAuth"
    );

    beginManualDiscordAuth(player);
  }

  /**
   * When the player has finished the discord auth process,
   * we can continue with the rest of the auth process.
   */
  @onClient(ServerEvents.FromClient.DISCORD_AUTH_DONE) // native altv discord auth
  @on("MANUAL_DISCORD_AUTH_DONE") // webserver based discord auth
  async onDiscordAuthDone(player: alt.Player, token: string) {
    checkForQuestionableActivity(
      player,
      player.store.isLoggedIn,
      "onDiscordAuthDone"
    );

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
