import { isItemKeyHatchet } from "@shared/modules/items";
import { useCharacter } from "@/core/store/character.store";

export function hasHatchetInHand() {
  const currentTool = useCharacter().equipment.weapon?.key;

  if (!currentTool) {
    return false;
  }

  return isItemKeyHatchet(currentTool);
}
