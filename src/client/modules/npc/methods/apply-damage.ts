import { RPC } from "@shared/constants/rpcs";
import { rpc } from "@/rpc";
import { StreamedNpc } from "../ped";

export async function applyDamage(this: StreamedNpc, damageData: any) {
  const health = await rpc.callServer<number>(
    RPC.Server.APPLY_NPC_DAMAGE,
    this.npc.id,
    damageData
  );
  this.npc.health = health;
}
