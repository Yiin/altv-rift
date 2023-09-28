import * as alt from "@altv/server";
import { ServerCall } from "@shared/calls/server";
import { rpc } from "@/core/rpc";

rpc.registerClient(
  ServerCall.FromClient.TOGGLE_VEHICLE_DOOR,
  (player: alt.Player, vehicleId: number, doorId: number, shouldClose = true) => {
    const vehicle = alt.Vehicle.getByID(vehicleId);

    if (!vehicle) {
      return;
    }

    if (shouldClose) {
      vehicle.setDoorState(doorId, 0);
    } else {
      vehicle.setDoorState(doorId, 7);
    }
  }
);

//
