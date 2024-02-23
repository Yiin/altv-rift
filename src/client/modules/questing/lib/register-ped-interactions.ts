import alt from "@altv/client";
import { PedKey } from "@shared/modules/ped/list";
import { PedInteraction } from "@shared/modules/ped/interactions";
import { IconName } from "@/core/rmlui/components/icon";

export type PedInteractionRegistration = (ped: alt.Ped) => PedInteraction<IconName>[];

const pedInteractions = new Map<PedKey, PedInteractionRegistration[]>();

export function registerPedInteractions(
  pedKey: PedKey,
  pedInteraction: PedInteractionRegistration
) {
  if (!pedInteractions.has(pedKey)) {
    pedInteractions.set(pedKey, []);
  }
  pedInteractions.get(pedKey)!.push(pedInteraction);
}

export function getPedInteractions(pedKey: PedKey) {
  return pedInteractions.get(pedKey) ?? [];
}
