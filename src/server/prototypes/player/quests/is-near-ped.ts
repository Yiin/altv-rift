import alt from "@altv/server";
import { PedKey } from "@shared/modules/ped/list";
import { InGamePlayer } from "@/core/utility/assertions";
import { getPedByKey } from "@/modules/peds/registry";

declare module "@altv/server" {
  export interface Player {
    isNearPed: (this: InGamePlayer, pedKey: PedKey, distance?: number) => boolean;
  }
}

alt.Player.prototype.isNearPed = function (pedKey, distance = 5) {
  const ped = getPedByKey(pedKey);
  return typeof ped !== "undefined" && this.pos.distanceTo(ped.pos) <= distance;
};
