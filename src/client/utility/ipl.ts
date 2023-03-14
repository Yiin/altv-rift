import alt from "alt-client";
import native from "natives";
import { ClientEvents } from "@shared/events/client";

alt.onServer(ClientEvents.FromServer.IPL_LOAD, (name: string) => {
  native.requestIpl(name);
});

alt.onServer(ClientEvents.FromServer.IPL_UNLOAD, (name: string) => {
  native.removeIpl(name);
});
