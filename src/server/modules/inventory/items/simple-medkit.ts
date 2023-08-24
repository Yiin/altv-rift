import alt from "alt-server";
import { ServerEvents } from "@shared/events/server";
import { needsToBeInGame } from "@/utility/assertions";

alt.on(ServerEvents.FromServer.USE_ITEM, (player, item) => {
  needsToBeInGame(player);

  if (item.data.key === "simple_medkit") {
    player.removeItemByKey(item.data.key, 1);
  }
});
