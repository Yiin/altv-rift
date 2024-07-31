import { isItemKeyPickaxe } from "@shared/modules/items";
import { useCharacter } from "@/core/store/character.store";

export function hasPickaxeInHand() {
  const currentTool = useCharacter().equipment.weapon?.key;

  if (!currentTool) {
    return false;
  }

  return isItemKeyPickaxe(currentTool);
}
