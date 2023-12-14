import * as alt from "@altv/client";
import { whileInGame } from "@/core/game-state-hooks/in-game.state";
import {
  hasHatchetInHand,
  isNextToTree,
  isTryingToChop,
  getChoppingTree,
  doTheChopping,
} from "./lib";

whileInGame(() => {
  const tick = alt.Timers.everyTick(async () => {
    if (hasHatchetInHand() && isNextToTree()) {
      if (isTryingToChop()) {
        const tree = getChoppingTree();
        await doTheChopping(tree);
      }
    }
  });

  return () => {
    tick.destroy();
  };
});
