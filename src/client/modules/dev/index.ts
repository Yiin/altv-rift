import alt from "alt-client";
import { ServerEvents } from "@shared/events/server";

alt.on("playerWeaponShoot", () => {
  alt.emitServerRaw(ServerEvents.FromClient.WEAPON_SHOOT);
});
