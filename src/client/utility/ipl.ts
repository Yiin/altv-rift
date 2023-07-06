import alt from "alt-client";
import game from "natives";
import { ClientEvents } from "@shared/events/client";

alt.onServer(ClientEvents.FromServer.IPL_LOAD, (name: string) => {
  game.requestIpl(name);
});

alt.onServer(ClientEvents.FromServer.IPL_UNLOAD, (name: string) => {
  game.removeIpl(name);
});
