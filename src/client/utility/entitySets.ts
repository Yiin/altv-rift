import alt from "alt-client";
import native from "natives";
import { RPC } from "@shared/constants/rpcs";
import { Events } from "@shared/constants/events";
import { rpc } from "@/rpc";

alt.onServer(
  Events.Client.ENTITYSET_ACTIVATE,
  (interior: number, entitySetName: string) => {
    native.activateInteriorEntitySet(interior, entitySetName);
    native.refreshInterior(interior);
  }
);

alt.onServer(
  Events.Client.ENTITYSET_DEACTIVATE,
  (interior: number, entitySetName: string) => {
    native.deactivateInteriorEntitySet(interior, entitySetName);
    native.refreshInterior(interior);
  }
);

rpc.registerServer(
  RPC.Client.ENTITYSET_IS_ACTIVE,
  (interior: number, entitySetName: string) =>
    native.isInteriorEntitySetActive(interior, entitySetName)
);
