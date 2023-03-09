import native from "natives";
import { MAX_PED_HEALTH } from "../constants";
import { StreamedNpc } from "../ped";

type PedID = number;
type Timestamp = number;

let lastFireTick = new Map<PedID, Timestamp>();

export function applyFireDamage(npc: StreamedNpc) {
  if (
    native.isEntityOnFire(npc.ped) &&
    (lastFireTick.get(npc.ped) ?? 0) < Date.now() - 100
  ) {
    native.applyDamageToPed(
      npc.ped,
      (30 / npc.npc.totalHealth) * MAX_PED_HEALTH,
      true,
      0
    );
    lastFireTick.set(npc.ped, Date.now());
    return 30;
  }
  return 0;
}
