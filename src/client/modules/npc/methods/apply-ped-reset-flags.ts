import game from "natives";
import { PED_RESET_FLAG } from "../constants/ped-flags";

export function applyPedResetFlags(ped: number) {
  game.setPedResetFlag(
    ped,
    PED_RESET_FLAG.BlockFallTaskFromExplosionDamage,
    true
  );
  game.setPedResetFlag(ped, PED_RESET_FLAG.PreventAllMeleeTakedowns, true);
  game.setPedResetFlag(ped, PED_RESET_FLAG.ForceMeleeCounter, true);
  // game.setPedResetFlag(ped, PED_RESET_FLAG.UseKinematicPhysics, true);
  game.setPedResetFlag(ped, PED_RESET_FLAG.DisablePlayerJumping, true);
  game.setPedResetFlag(
    ped,
    PED_RESET_FLAG.BlockWeaponReactionsUnlessDead,
    true
  );
  game.setPedResetFlag(
    ped,
    PED_RESET_FLAG.DisablePotentialBlastReactions,
    true
  );
}
