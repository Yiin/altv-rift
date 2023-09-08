import alt from "alt-client";
import game from "natives";
import { ClientEvents } from "@shared/events/client";

alt.onServer(
  ClientEvents.FromServer.SET_PLAYER_DECORATIONS,
  (decorations: { collection: string; overlay: string }[]) => {
    game.clearPedDecorations(alt.Player.local);

    for (const decoration of decorations) {
      const collection = alt.hash(decoration.collection);
      const overlay = alt.hash(decoration.overlay);
      game.addPedDecorationFromHashes(alt.Player.local, collection, overlay);
    }
  }
);
