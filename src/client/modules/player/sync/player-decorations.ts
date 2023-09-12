import * as alt from "@altv/client";
import game from "@altv/natives";
import { ClientEvents } from "@shared/events/client";

alt.Events.onServer(ClientEvents.FromServer.SET_PLAYER_DECORATIONS, (decorations) => {
  game.clearPedDecorations(alt.Player.local);

  for (const decoration of decorations) {
    const collection = decoration.collection;
    const overlay = decoration.overlay;
    game.addPedDecorationFromHashes(alt.Player.local, collection, overlay);
  }
});
