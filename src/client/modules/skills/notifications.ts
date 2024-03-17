import { watch } from "vue";
import { getLevel } from "@shared/modules/experience/experience-table";
import { whileInGame } from "@/core/game-state-hooks/in-game.state";
import { useCharacter } from "@/core/store/character.store";
import { addInfoMessage, addSuccessMessage } from "../chat";

whileInGame(() => {
  const watchers = [
    watch(
      () => useCharacter().skills.woodcutting,
      (newXp, prevXp) => {
        if (newXp > prevXp) {
          addInfoMessage(`You have gained ${newXp - prevXp} Woodcutting experience.`);
        }
        if (getLevel(newXp) > getLevel(prevXp)) {
          addSuccessMessage(
            `You have advanced a Woodcutting level! You are now level ${getLevel(newXp)}.`,
          );
        }
      },
    ),
    watch(
      () => useCharacter().skills.fishing,
      (newXp, prevXp) => {
        if (newXp > prevXp) {
          addInfoMessage(`You have gained ${newXp - prevXp} Fishing experience.`);
        }
        if (getLevel(newXp) > getLevel(prevXp)) {
          addSuccessMessage(
            `You have advanced a Fishing level! You are now level ${getLevel(newXp)}.`,
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
