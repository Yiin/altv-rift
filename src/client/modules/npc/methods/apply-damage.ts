import { ServerCall } from "@shared/calls/server";
import { rpc } from "@/rpc";
import { StreamedNpc } from "../ped";

export async function applyDamage(this: StreamedNpc, damageData: any) {
  const health = await rpc.callServer(
    ServerCall.FromClient.APPLY_NPC_DAMAGE,
    this.npc.id,
    damageData
  );
  this.npc.health = health;
}
