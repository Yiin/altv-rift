import { watch } from "vue";
import { getLevel, isLevelUp } from "@shared/modules/experience/experience-table";
import { whileInGame } from "@/core/game-state-hooks/in-game.state";
import { useCharacter } from "@/core/store/character.store";
import { addSuccessMessage } from "../chat";

whileInGame(() => {
  const watchers = [
    watch(
      () => useCharacter().skills.woodcutting.exp,
      (newXp, prevXp) => {
        if (isLevelUp(prevXp, newXp)) {
          addSuccessMessage(
            `You have advanced a Woodcutting level! You are now level ${getLevel(newXp)}.`,
          );
        }
      },
    ),
    watch(
      () => useCharacter().skills.fishing.exp,
      (newXp, prevXp) => {
        if (isLevelUp(prevXp, newXp)) {
          addSuccessMessage(
            `You have advanced a Fishing level! You are now level ${getLevel(newXp)}.`,
          );
        }
      },
    ),
    watch(
      () => useCharacter().skills.mining.exp,
      (newXp, prevXp) => {
        if (isLevelUp(prevXp, newXp)) {
          addSuccessMessage(
            `You have advanced a Mining level! You are now level ${getLevel(newXp)}.`,
          );
        }
      },
    ),
  ];

  return () => {
    for (const stop of watchers) {
      stop();
    }
  };
});
