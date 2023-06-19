import alt from "alt-client";
import native from "natives";
import { ClientEvents } from "@shared/events/client";
import { ClientCall } from "@shared/calls/client";
import { rpc } from "@/rpc";

alt.onServer(
  ClientEvents.FromServer.ENTITYSET_ACTIVATE,
  (interior: number, entitySetName: string) => {
    native.activateInteriorEntitySet(interior, entitySetName);
    native.refreshInterior(interior);
  }
);

alt.onServer(
  ClientEvents.FromServer.ENTITYSET_DEACTIVATE,
  (interior: number, entitySetName: string) => {
    native.deactivateInteriorEntitySet(interior, entitySetName);
    native.refreshInterior(interior);
  }
);

rpc.registerServer(
  ClientCall.FromServer.ENTITYSET_IS_ACTIVE,
  (interior: number, entitySetName: string) =>
    native.isInteriorEntitySetActive(interior, entitySetName)
);
