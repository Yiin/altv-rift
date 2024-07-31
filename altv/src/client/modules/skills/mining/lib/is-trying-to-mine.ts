import alt from "@altv/client";
import game from "@altv/natives";
import { ControlType, Control } from "@/core/constants/controls";
import { isMiningOre } from "./is-mining-ore";

export function isTryingToMine() {
  game.disablePlayerFiring(alt.Player.local, false);
  game.disableControlAction(ControlType.PLAYER_CONTROL, Control.INPUT_ATTACK, true);

  return (
    !isMiningOre() &&
    game.isDisabledControlJustPressed(ControlType.PLAYER_CONTROL, Control.INPUT_ATTACK)
  );
}
