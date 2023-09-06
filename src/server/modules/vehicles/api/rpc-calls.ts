import alt from "alt-server";
import { ServerCall } from "@shared/calls/server";
import { rpc } from "@/rpc";

rpc.registerClient(ServerCall.FromClient.TOGGLE_VEHICLE_DOOR, (player: alt.Player, vehicleId: number, doorId: number) => {
  const vehicle = alt.Vehicle.getByID(vehicleId);

  if (!vehicle) {
    return;
  }

  if (vehicle.getDoorState(doorId) !== 0) {
    vehicle.setDoorState(doorId, 0);
  } else {
    vehicle.setDoorState(doorId, 7);
  }
});