import game from "natives";
import { MAX_PED_HEALTH } from "../constants";
import { StreamedNpc } from "../ped";

declare module "../ped" {
  interface StreamedNpc {
    applyFireDamage: typeof applyFireDamage;
  }
}

type PedID = number;
type Timestamp = number;

let lastFireTick = new Map<PedID, Timestamp>();

function applyFireDamage(this: StreamedNpc) {
  if (
    game.isEntityOnFire(this.ped) &&
    (lastFireTick.get(this.ped) ?? 0) < Date.now() - 100
  ) {
    game.applyDamageToPed(
      this.ped,
      (30 / this.npc.maxHealth) * MAX_PED_HEALTH,
      true,
      0
    );
    lastFireTick.set(this.ped, Date.now());
    return 30;
  }
  return 0;
}

StreamedNpc.prototype.applyFireDamage = applyFireDamage;
