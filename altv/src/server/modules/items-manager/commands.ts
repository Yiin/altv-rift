import { isValidItem, createItem, ItemGrade } from "@shared/modules/items";
import { needsToBeInGame } from "@/core/utility/assertions";
import { registerCmd } from "../chat";
import { NotificationType } from "@shared/interfaces";

registerCmd("additem", (player, [key, ...amountAndGrade]) => {
  needsToBeInGame(player);

  if (!isValidItem(key)) {
    player.notify(NotificationType.Error, "Unknown item.");
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
    player.notify(
      NotificationType.Error,
      `Invalid item grade. Available grades: ${availableGrades.join(", ")}`,
    );
    return;
  }

  const item = createItem(key, {
    amount: amount ? Math.max(1, +amount) : 1,
    ...(grade ? { grade } : {}),
  });

  if (!item) {
    player.notify(NotificationType.Error, "Couldn't create item.");
    return;
  }

  player.addItem(item);
});
