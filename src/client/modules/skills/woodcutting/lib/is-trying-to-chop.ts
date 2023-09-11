import game from "@altv/natives";
import { ControlType, Control } from "@/core/constants/controls";
import { isChoppingTree } from "./is-chopping-tree";

export function isTryingToChop() {
  game.disableControlAction(ControlType.PLAYER_CONTROL, Control.INPUT_ATTACK, true);

  return (
    !isChoppingTree() &&
    game.isDisabledControlJustPressed(ControlType.PLAYER_CONTROL, Control.INPUT_ATTACK)
  );
}
