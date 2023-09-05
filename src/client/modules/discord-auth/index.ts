import alt from "alt-client";
import game from "natives";
import { ClientEvents } from "@shared/events/client";
import { ServerEvents } from "@shared/events/server";
import { WebviewEvents } from "@shared/events/webview";
import { ServerCall } from "@shared/calls/server";
import { SCENE } from "@/constants/ui";
import { getWebview, setScene } from "@/user-interface/webview";
import { rpc } from "@/rpc";

// TODO: it should be possible to use process.env here, but
// I'm too lazy to figure out how to set it up for client build
const DISCORD_CLIENT_ID = "1063548870640029727";

async function beginAuth() {
  // Check for cached token
  if (alt.LocalStorage.get("token")) {
    const success = await rpc.callServer(
      ServerCall.FromClient.TRY_CACHED_TOKEN,
      alt.LocalStorage.get("token")
    );

    if (success) {
      return;
    }

    alt.LocalStorage.delete("token");
  }

  try {
    // try native discord api (requires running discord client)
    const token = await alt.Discord.requestOAuth2Token(DISCORD_CLIENT_ID);
    alt.emitServer(ServerEvents.FromClient.DISCORD_AUTH_DONE, token);
    cacheAuthToken(token);
  } catch (e) {
    // fallback to manual discord auth (opens browser)
    const url = await rpc.callServer(ServerCall.FromClient.GET_DISCORD_AUTH_URL);

    setScene(SCENE.DISCORD_AUTH);
    getWebview((webview) => {
      webview.emit(WebviewEvents.FromClient.SETUP_DISCORD_AUTH, url);
    });

    game.doScreenFadeIn(1000);
  }
}
alt.onServer(ClientEvents.FromServer.BEGIN_NATIVE_DISCORD_AUTH, beginAuth);

function cacheAuthToken(token: string) {
  alt.LocalStorage.set("token", token);
  alt.LocalStorage.save();
}
alt.onServer(ClientEvents.FromServer.REMEMBER_AUTH_TOKEN, cacheAuthToken);
