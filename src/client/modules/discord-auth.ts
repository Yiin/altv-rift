import alt from "alt-client";
import native from "natives";
import { Events } from "@shared/constants/events";

const DISCORD_CLIENT_ID = "1063548870640029727";

async function getOAuthToken() {
  try {
    const token = await alt.Discord.requestOAuth2Token(DISCORD_CLIENT_ID);
    alt.emitServer(Events.Server.DISCORD_AUTH_DONE, token);
    native.doScreenFadeOut(1000);
  } catch (e) {
    alt.log("quitGame");
    alt.logError(e);
    // Error can be due invalid app id, discord server issues or the user denying access.
    // native.quitGame();
  }
}

alt.onServer(Events.Client.DISCORD_BEGIN_AUTH, getOAuthToken);
