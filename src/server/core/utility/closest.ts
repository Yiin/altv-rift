import { IVector3 } from "@altv/shared";
import alt from "@altv/server";
import { getClosestOfType } from "@shared/utility/closest";
import { InGamePlayer, isInGame } from "./assertions";

/**
 * Gets the closest vehicle to a position.
 */
export function getClosestVehicle(pos: IVector3): alt.Vehicle | undefined {
  const vehicles = alt.Vehicle.all;
  return getClosestOfType<alt.Vehicle>(pos, vehicles);
}

/**
 * Gets the closest player to a position.
 */
export function getClosestPlayer(pos: IVector3) {
  const players = alt.Player.all.filter((p): p is InGamePlayer => isInGame(p));
  return getClosestOfType(pos, players);
}
