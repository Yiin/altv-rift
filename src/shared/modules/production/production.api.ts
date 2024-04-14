import { Inventory } from "@shared/interfaces";
import { deepCloneObject } from "@shared/utility/deep-copy";
import { Item } from "../items";
import { findFreeInventorySlot, removeItemFromInventorySlot } from "../inventory/api";
import { BlueprintRecipe } from "./types";

export enum CraftingResult {
  OK,
  NOT_ENOUGH_MATERIALS,
  NO_SPACE_IN_INVENTORY,
}

export function canCraftRecipe(recipe: BlueprintRecipe, inventory: Inventory): CraftingResult {
  return craftRecipe(recipe, inventory, { isTestRun: true });
}

export function craftRecipe(
  recipe: BlueprintRecipe,
  inventory: Inventory,
  { isTestRun = false } = {},
): CraftingResult {
  const { parts } = recipe;

  // If we're not currently in the test, we should run a test
  // before operating on the real inventory.
  // This prevents cases where item can be crafted but there
  // is no free slot in the inventory. Also handes cases where
  // inventory slot is freed by using resources need for the
  // crafting. And of course we check if we have enough resources.
  if (!isTestRun) {
    const testRunSuccess = craftRecipe(recipe, inventory, { isTestRun: true });

    if (testRunSuccess !== CraftingResult.OK) {
      return testRunSuccess;
    }
  } else {
    inventory = deepCloneObject(inventory);
  }

  const success = parts.every((part) => {
    const inventoryItem = inventory.items.find((inventoryItem) =>
      isMatchingPart(part, inventoryItem.item),
    );

    if (!inventoryItem) {
      return false;
    }

    removeItemFromInventorySlot(inventory, inventoryItem.slot, "amount" in part ? part.amount : 1);
    return true;
  });

  if (!success) {
    return CraftingResult.NOT_ENOUGH_MATERIALS;
  }

  const hasFreeSlot = findFreeInventorySlot(inventory) !== -1;

  if (!isTestRun && !hasFreeSlot) {
    console.warn("ERR: We tried to craft an item with no free slot in the inventory.");
  }

  if (!hasFreeSlot) {
    return CraftingResult.NO_SPACE_IN_INVENTORY;
  }

  return CraftingResult.OK;
}

export function isMatchingPart(part: Item, item: Item): boolean {
  if (part.key !== item.key) {
    return false;
  }

  if ("amount" in part && "amount" in item && part.amount > item.amount) {
    return false;
  }

  if ("grade" in part && "grade" in item && part.grade !== item.grade) {
    return false;
  }

  return true;
}
