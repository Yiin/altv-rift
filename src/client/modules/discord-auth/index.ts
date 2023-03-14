import alt from "alt-client";
import { SCENE } from "@shared/enums/ui";
import { ClientEvents } from "@shared/events/client";
import { ServerEvents } from "@shared/events/server";
import { WebviewEvents } from "@shared/events/webview";
import { getWebview, setScene } from "@/utility/user-interface";

const DISCORD_CLIENT_ID = "1063548870640029727";

alt.onServer(ClientEvents.FromServer.BEGIN_NATIVE_DISCORD_AUTH, getOAuthToken);
async function getOAuthToken() {
  try {
    const token = await alt.Discord.requestOAuth2Token(DISCORD_CLIENT_ID);
    alt.emitServer(ServerEvents.FromClient.DISCORD_AUTH_DONE, token);
  } catch {
    alt.emitServer(ServerEvents.FromClient.MANUAL_DISCORD_AUTH);
  }
}

alt.onServer(
  ClientEvents.FromServer.BEGIN_MANUAL_DISCORD_AUTH,
  handleDiscordAuth
);
function handleDiscordAuth(url: string) {
  setScene(SCENE.DISCORD_AUTH);
  getWebview((webview) => {
    webview.emit(WebviewEvents.FromClient.SETUP_DISCORD_AUTH, url);
  });
}
