import alt from "@altv/client";
import game from "@altv/natives";
import { ClientEvents } from "@shared/events/client";

alt.Events.onServer(ClientEvents.FromServer.CALL_NATIVE, (native, ...args) => {
  const nativeArgs = args.map((arg) => {
    if (arg instanceof alt.Entity) {
      return arg.scriptID;
    }

    return arg;
  });

  try {
    console.log(`Calling native ${native} with args:`, nativeArgs);

    // @ts-expect-error
    game[native](...nativeArgs);
  } catch { }
});
