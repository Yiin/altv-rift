import alt from "alt-client";
import { getWeaponHash } from "@shared/modules/items";

export function hasHatchetInHand() {
  return alt.Player.local.currentWeapon === getWeaponHash("hatchet");
}
