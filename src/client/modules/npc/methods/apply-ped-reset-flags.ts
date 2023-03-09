import native from "natives";
import { PED_RESET_FLAG } from "../constants/ped-flags";

export function applyPedResetFlags(ped: number) {
  native.setPedResetFlag(
    ped,
    PED_RESET_FLAG.BlockFallTaskFromExplosionDamage,
    true
  );
  native.setPedResetFlag(ped, PED_RESET_FLAG.PreventAllMeleeTakedowns, true);
  native.setPedResetFlag(ped, PED_RESET_FLAG.ForceMeleeCounter, true);
  // native.setPedResetFlag(ped, PED_RESET_FLAG.UseKinematicPhysics, true);
  native.setPedResetFlag(ped, PED_RESET_FLAG.DisablePlayerJumping, true);
  native.setPedResetFlag(
    ped,
    PED_RESET_FLAG.BlockWeaponReactionsUnlessDead,
    true
  );
  native.setPedResetFlag(
    ped,
    PED_RESET_FLAG.DisablePotentialBlastReactions,
    true
  );
}
