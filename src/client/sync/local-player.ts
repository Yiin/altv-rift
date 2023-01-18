import alt from "alt-client";
import native from "natives";
import { Events } from "@shared/constants/events";

alt.onServer(
  Events.Client.SET_PLAYER_DECORATIONS,
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
