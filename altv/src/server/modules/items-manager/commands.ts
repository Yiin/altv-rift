import { isValidItem, createItem, getItemName, ItemGrade } from "@shared/modules/items";
import { needsToBeInGame } from "@/core/utility/assertions";
import { registerCmd, sendChatMessage } from "../chat";

registerCmd("additem", (player, [key, ...amountAndGrade]) => {
  needsToBeInGame(player);

  if (!isValidItem(key)) {
    sendChatMessage(player, "Unknown item.");
    return;
  }

  const amount = amountAndGrade.find((x) => !Number.isNaN(x));
  const grade = amountAndGrade.find((x) => Number.isNaN(+x));

  const availableGrades = [
    ItemGrade.COMMON,
    ItemGrade.UNCOMMON,
    ItemGrade.RARE,
    ItemGrade.EPIC,
    ItemGrade.LEGENDARY,
    ItemGrade.CONTRABAND,
    ItemGrade.LIMITED,
  ];

  if (grade && !availableGrades.includes(grade)) {
    sendChatMessage(player, `Invalid item grade. Available grades: ${availableGrades.join(", ")}`);
    return;
  }

  const item = createItem(key, { amount: amount ? Math.max(1, +amount) : 1, ...(grade ? { grade } : {}) });

  if (!item) {
    sendChatMessage(player, "Couldn't create item.");
    return;
  }

  sendChatMessage(player, `+${amount ? +amount : 1} ${getItemName(key)}`);
  player.addItem(item);
});
