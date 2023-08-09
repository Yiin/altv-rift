import alt from "alt-server";
import { ServerEvents } from "@shared/events/server";

alt.on(ServerEvents.FromServer.USE_ITEM, (player, item) => {
  if (item.data.key === "simple_medkit") {
    alt.log("USE_ITEM: simple_medkit");
    player.removeItem(item.data.key, 1);
  }
});
