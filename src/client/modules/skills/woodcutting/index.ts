import alt from "alt-client";
import { whileInGame } from "@/core/game-state/in-game.state";
import {
  hasHatchetInHand,
  isNextToTree,
  isTryingToChop,
  getChoppingTree,
  doTheChopping,
} from "./lib";

whileInGame(() => {
  const tick = alt.everyTick(async () => {
    if (hasHatchetInHand() && isNextToTree()) {
      if (isTryingToChop()) {
        const tree = getChoppingTree();
        await doTheChopping(tree);
      }
    }
  });

  return () => {
    alt.clearEveryTick(tick);
  };
});
