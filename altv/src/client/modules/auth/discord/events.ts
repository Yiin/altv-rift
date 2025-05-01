import alt from "@altv/client";
import game from "@altv/natives";
import { ClientEvents } from "@shared/events/client";
import { ServerEvents } from "@shared/events/server";
import { WebviewEvents } from "@shared/events/webview";
import { ServerCall } from "@shared/calls/server";
import { Scene } from "@shared/enums/ui";
import { useWebview, setScene } from "@/core/user-interface/webview";
import { rpc } from "@/core/rpc";

// TODO: it should be possible to use process.env here, but
// I'm too lazy to figure out how to set it up for client build
const DISCORD_CLIENT_ID = "1063548870640029727";

declare module "@altv/client" {
  namespace LocalStorage {
    interface LocalStorage {
      token: string;
    }
  }
}

alt.Events.onConsoleCommand(({ command }) => {
  if (command === "discordauth") {
    beginAuth().catch(console.error);
  }
});

async function beginAuth() {
  // Check for cached token
  if (alt.LocalStorage.has("token")) {
    const success = await rpc.callServer(
      ServerCall.FromClient.TRY_CACHED_TOKEN,
      alt.LocalStorage.get("token"),
    );

    if (success) {
      console.log("Cached token worked");
      return;
    }

    console.log("Cached token failed");
    alt.LocalStorage.remove("token");
  }

  try {
    // try native discord api (requires running discord client)
    console.log("Requesting discord auth token");
    const timeout = new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 10000);
    });

    const token = await Promise.race([
      alt.Discord.requestOAuth2Token(DISCORD_CLIENT_ID),
      timeout,
    ]);

    if (!token) {
      throw new Error("Failed to get discord auth token");
    }

    console.log("Received discord auth token");
    alt.Events.emitServerRaw(ServerEvents.FromClient.DISCORD_AUTH_DONE, token);
    cacheAuthToken(token);
  } catch (e) {
    console.log("Failed to get discord auth token, fallback to discord auth url");
    // fallback to manual discord auth (opens browser)
    const url = await rpc.callServer(ServerCall.FromClient.GET_DISCORD_AUTH_URL);

    console.log("Opening discord auth url", url);

    setScene(Scene.DISCORD_AUTH, { hasCursor: true });
    useWebview((webview) => {
      webview.emitRaw(WebviewEvents.FromClient.SETUP_DISCORD_AUTH, url);
    });

    game.doScreenFadeIn(1000);
  }
}

alt.Events.onServer(ClientEvents.FromServer.BEGIN_NATIVE_DISCORD_AUTH, () => {
  beginAuth().catch(console.error);
});

function cacheAuthToken(token: string) {
  alt.LocalStorage.set("token", token);
  alt.LocalStorage.save();
}
alt.Events.onServer(ClientEvents.FromServer.REMEMBER_AUTH_TOKEN, cacheAuthToken);
