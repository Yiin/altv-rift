import { RPC } from "@shared/constants/rpcs";
import rpc from "altv-rpc";
import native from "natives";

rpc.on(
  RPC.Client.ENTITYSET_ACTIVATE,
  ({
    interior,
    entitySetName,
  }: {
    interior: number;
    entitySetName: string;
  }) => {
    native.activateInteriorEntitySet(interior, entitySetName);
    native.refreshInterior(interior);
  }
);

rpc.on(
  RPC.Client.ENTITYSET_DEACTIVATE,
  ({
    interior,
    entitySetName,
  }: {
    interior: number;
    entitySetName: string;
  }) => {
    native.deactivateInteriorEntitySet(interior, entitySetName);
    native.refreshInterior(interior);
  }
);

rpc.register(
  RPC.Client.ENTITYSET_IS_ACTIVE,
  ({ interior, entitySetName }: { interior: number; entitySetName: string }) =>
    native.isInteriorEntitySetActive(interior, entitySetName)
);
