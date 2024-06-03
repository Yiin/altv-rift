import alt from "@altv/client";
import { IconName } from "@/core/rmlui/components/icon";
import { registerPedInteractions } from "@/modules/questing/lib/register-ped-interactions"
import { PedInteraction } from "@shared/modules/ped/interactions";
import { PedKey } from "@shared/modules/ped/list";
import { ServerEvents } from "@shared/events/server";

registerPedInteractions(PedKey.JOHN_WICK, (ped) => {
  const interactions: PedInteraction<IconName>[] = [];

  interactions.push({
    key: "get-ratbike",
    icon: "trade",
    label: "Get Ratbike",
    onSelect() {
      alt.Events.emitServerRaw(ServerEvents.FromClient.GET_RATBIKE);
    }
  })

  return interactions;
});