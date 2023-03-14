import alt from "alt-client";
import native from "natives";
import { ClientEvents } from "@shared/events/client";

alt.onServer(
  ClientEvents.FromServer.SET_PLAYER_DECORATIONS,
  (decorations: { collection: string; overlay: string }[]) => {
    native.clearPedDecorations(alt.Player.local.scriptID);

    for (const decoration of decorations) {
      const collection = alt.hash(decoration.collection);
      const overlay = alt.hash(decoration.overlay);
      native.addPedDecorationFromHashes(
        alt.Player.local.scriptID,
        collection,
        overlay
      );
    }
  }
);
