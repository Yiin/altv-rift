import alt from "@altv/client";
import { whileInGame } from "@/core/game-state-hooks/in-game.state";
import {
  hasHatchetInHand,
  isNextToTree,
  isTryingToChop,
  getChoppingTree,
  doTheChopping,
} from "./lib";
import { clientState } from "@/core/store/client.store";
import { ActionTipType } from "@shared/store/client.store";

whileInGame(() => {
  const tick = alt.Timers.everyTick(async () => {
    if (hasHatchetInHand() && isNextToTree()) {
      if (!clientState.actionTip) {
        clientState.actionTip = {
          type: ActionTipType.WOODCUTTING,
        };
      }
      if (isTryingToChop()) {
        const tree = getChoppingTree();
        await doTheChopping(tree);
      }
    } else {
      if (clientState.actionTip?.type === ActionTipType.WOODCUTTING) {
        clientState.actionTip = null;
      }
    }
  });

  return () => {
    tick.destroy();
  };
});
