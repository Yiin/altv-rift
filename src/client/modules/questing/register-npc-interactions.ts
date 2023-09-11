import alt from "@altv/client";
import { Npc } from "@shared/modules/npc/list";
import { NpcInteraction } from "@shared/modules/npc/interactions";
import { IconName } from "@/core/rmlui/components/icon/icon";

export type NpcInteractionRegistration = (ped: alt.Ped) => NpcInteraction<IconName>[];

const npcInteractions = new Map<Npc, NpcInteractionRegistration[]>();

export function registerNpcInteractions(npcKey: Npc, npcInteraction: NpcInteractionRegistration) {
  if (!npcInteractions.has(npcKey)) {
    npcInteractions.set(npcKey, []);
  }
  npcInteractions.get(npcKey)!.push(npcInteraction);
}

export function getNpcInteractions(npcKey: Npc) {
  return npcInteractions.get(npcKey) ?? [];
}
