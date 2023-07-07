import game from "natives";
import { PED_RESET_FLAG } from "../../npc/constants/ped-flags";
import { StreamedNpc } from "../ped";

declare module "../ped" {
  interface StreamedNpc {
    applyPedResetFlags: typeof applyPedResetFlags;
  }
}

function applyPedResetFlags(this: StreamedNpc) {
  game.setPedResetFlag(
    this.ped,
    PED_RESET_FLAG.BlockFallTaskFromExplosionDamage,
    true
  );
  game.setPedResetFlag(this.ped, PED_RESET_FLAG.PreventAllMeleeTakedowns, true);
  game.setPedResetFlag(this.ped, PED_RESET_FLAG.ForceMeleeCounter, true);
  // game.setPedResetFlag(this.ped, PED_RESET_FLAG.UseKinematicPhysics, true);
  game.setPedResetFlag(this.ped, PED_RESET_FLAG.DisablePlayerJumping, true);
  game.setPedResetFlag(
    this.ped,
    PED_RESET_FLAG.BlockWeaponReactionsUnlessDead,
    true
  );
  game.setPedResetFlag(
    this.ped,
    PED_RESET_FLAG.DisablePotentialBlastReactions,
    true
  );
}

StreamedNpc.prototype.applyPedResetFlags = applyPedResetFlags;
