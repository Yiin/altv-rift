import alt from "@altv/client";
import game from "@altv/natives";
import { ClientEvents } from "@shared/events/client";
import { ClientCall } from "@shared/calls/client";
import { rpc } from "@/core/rpc";

alt.Events.onServer(
  ClientEvents.FromServer.ENTITYSET_ACTIVATE,
  (interior: number, entitySetName: string) => {
    game.activateInteriorEntitySet(interior, entitySetName);
    game.refreshInterior(interior);
  }
);

alt.Events.onServer(
  ClientEvents.FromServer.ENTITYSET_DEACTIVATE,
  (interior: number, entitySetName: string) => {
    game.deactivateInteriorEntitySet(interior, entitySetName);
    game.refreshInterior(interior);
  }
);

rpc.registerServer(
  ClientCall.FromServer.ENTITYSET_IS_ACTIVE,
  (interior: number, entitySetName: string) =>
    game.isInteriorEntitySetActive(interior, entitySetName)
);
