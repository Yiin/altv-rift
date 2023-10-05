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
  alt.log("isInGame");
  const tick = alt.Timers.everyTick(async () => {
    if (hasHatchetInHand() && isNextToTree()) {
      alt.log("isReadyForChoping");
      if (isTryingToChop()) {
        alt.log("isTryingToChop");
        const tree = getChoppingTree();
        await doTheChopping(tree);
      }
    } else {
      // alt.log("isNotReadyForChoping", hasHatchetInHand(), isNextToTree());
    }
  });

  return () => {
    alt.log("Not in game anymore");
    tick.destroy();
  };
});
