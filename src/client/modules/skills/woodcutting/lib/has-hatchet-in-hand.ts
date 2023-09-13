import alt from "alt-client";
import { MeleeWeapon, getWeaponHash } from "@shared/modules/items";

export function hasHatchetInHand() {
  return alt.Player.local.currentWeapon === getWeaponHash(MeleeWeapon.HATCHET);
}
