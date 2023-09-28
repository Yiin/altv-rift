import { isValidItem, createItem } from "@shared/modules/items";
import { needsToBeInGame } from "@/core/utility/assertions";
import { registerCmd, sendChatMessage } from "../chat";

registerCmd("additem", (player, [key, amount]) => {
  needsToBeInGame(player);

  if (!isValidItem(key)) {
    sendChatMessage(player, "Unknown item.");
    return;
  }

  const item = createItem(key, { amount: amount ? +amount : 1 });

  if (!item) {
    sendChatMessage(player, "Couldn't create item.");
    return;
  }

  player.addItem(item);
});
