import alt from "@altv/server";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { ServerEvents } from "@shared/events/server";
import { ClientEvents } from "@shared/events/client";
import { ServerCall } from "@shared/calls/server";
import { container } from "@shared/dependency-injection";
import { User } from "@shared/interfaces";
import { checkForQuestionableActivity } from "@/core/utility/questionable-activity";
import { LoggedInPlayer, isLoggedIn } from "@/core/utility/assertions";
import { emit, on } from "@/core/events/emit";
import { rpc } from "@/core/rpc";
import { getDiscordAuthUrl } from "./verify";
import "./webserver";

const prisma = container.get(PrismaClient);

alt.Events.onPlayerConnect(({ player }) => {
  player.dimension = player.id;
  player.spawn(alt.Vector3.zero);
  player.setup();
});

/**
 * When a player joins a server, we need to wait for them to
 * setup their game before we can continue with the auth process.
 *
 * BEGIN_CONNECTION event is fired when the player is ready to
 * receive data from the server.
 */
alt.Events.onPlayer(ServerEvents.FromClient.BEGIN_CONNECTION, (player) => {
  checkForQuestionableActivity(player, isLoggedIn(player), "onBeginConnection");

  player.emitRaw(ClientEvents.FromServer.BEGIN_NATIVE_DISCORD_AUTH);
});

rpc.registerClient(ServerCall.FromClient.GET_DISCORD_AUTH_URL, (player) => {
  return getDiscordAuthUrl(player);
});

rpc.registerClient(ServerCall.FromClient.TRY_CACHED_TOKEN, async (player, token) => {
  const discordInfo = await getDiscordInfo(token);

  if (!discordInfo) {
    return false;
  }

  await onDiscordAuthDone(player, token);
  return true;
});

alt.Events.onPlayer(ServerEvents.FromClient.DISCORD_AUTH_DONE, (player, token) => {
  onDiscordAuthDone(player, token);
});

// native altv discord auth
// webserver based discord auth
on(ServerEvents.FromServer.MANUAL_DISCORD_AUTH_DONE, (player, token) =>
  onDiscordAuthDone(player, token)
);

async function onDiscordAuthDone(player: alt.Player, token: string) {
  checkForQuestionableActivity(player, isLoggedIn(player), "onDiscordAuthDone");

  const discordInfo = await getDiscordInfo(token);

  if (!discordInfo) {
    player.kick("Authorization failed");
    return;
  }

  alt.log(`${discordInfo.username}#${discordInfo.discriminator}`);

  const user = (await prisma.user.upsert({
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
  })) as User;

  await player.loadUser(user);

  emit(ServerEvents.FromServer.USER_LOAD, player as LoggedInPlayer);
}

async function getDiscordInfo(token: string) {
  const request = await axios
    .get("https://discordapp.com/api/users/@me", {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    })
    .catch(() => null);

  // Check if the request was successful and if the neccessary properties are included
  if (!request || !request.data || !request.data.id || !request.data.username) {
    return null;
  }

  return request.data;
}
