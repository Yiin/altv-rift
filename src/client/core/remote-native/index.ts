import alt from "@altv/client";
import game from "@altv/natives";
import { ClientEvents } from "@shared/events/client";

alt.Events.onServer(ClientEvents.FromServer.CALL_NATIVE, (native, ...args) => {
  try {
    // @ts-expect-error
    game[native]?.(...args);
  } catch { }
});
