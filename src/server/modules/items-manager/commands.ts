import { isValidItem, createItem } from "@shared/modules/items";
import { needsToBeInGame } from "@/utility/assertions";
import { registerCmd } from "../chat";

registerCmd("additem", (player, [key, amount]) => {
  needsToBeInGame(player);

  if (!isValidItem(key)) {
    return;
  }

  const item = createItem(key, amount ? { amount: +amount } : undefined);

  if (!item) {
    return;
  }

  player.addItem(item);
});
