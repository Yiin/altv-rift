import alt from "alt-client";
import native from "natives";
import { Events } from "@shared/constants/events";

alt.onServer(Events.Client.IPL_LOAD, (name: string) => {
  native.requestIpl(name);
});

alt.onServer(Events.Client.IPL_UNLOAD, (name: string) => {
  native.removeIpl(name);
});
