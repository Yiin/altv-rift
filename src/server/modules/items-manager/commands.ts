import { isValidItem, createItem, getItemName } from "@shared/modules/items";
import { needsToBeInGame } from "@/core/utility/assertions";
import { registerCmd, sendChatMessage } from "../chat";

registerCmd("additem", (player, [key, amount, grade]) => {
  needsToBeInGame(player);

  if (!isValidItem(key)) {
    sendChatMessage(player, "Unknown item.");
    return;
  }

  const item = createItem(key, { amount: amount ? +amount : 1, grade });

  if (!item) {
    sendChatMessage(player, "Couldn't create item.");
    return;
  }

  sendChatMessage(player, `+${amount ? +amount : 1} ${getItemName(key)}`);
  player.addItem(item);
});
