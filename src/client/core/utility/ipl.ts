import * as alt from "@altv/client";
import * as game from "@altv/natives";
import { ClientEvents } from "@shared/events/client";

alt.Events.onServer(ClientEvents.FromServer.IPL_LOAD, (name: string) => {
  game.requestIpl(name);
});

alt.Events.onServer(ClientEvents.FromServer.IPL_UNLOAD, (name: string) => {
  game.removeIpl(name);
});
