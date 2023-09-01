import { defineStore } from "pinia";
import { getDefaultClientStoreState, QuestRegistration } from "@shared/store/client.store";
import { useCharacter } from "./character.store";

export const useClient = defineStore("client", {
  state: getDefaultClientStoreState,
  getters: {
    questFacts(state) {
      return (
        useCharacter().questFacts ?? [
          "Quests.Introduction.Facts.GOT_INTRODUCTION",
          "Quests.Introduction.Facts.USED_MEDKIT",
          "Quests.Introduction.Facts.GOT_DIRECTIONS",
          "Quests.Introduction.Facts.DIEGO_INTRO",
          "Quests.Introduction.Facts.PICKED_WOODCUTTING",
          "Quests.Introduction.Facts.COMPLETED_WOODCUTTING",
          "Quests.Introduction.Facts.PICKED_FISHING",
        ]
      );
    },
    activeQuests(state) {
      const quests: QuestRegistration[] = [];

      for (const quest of state.quests.values()) {
        const visibleTasks = quest.tasks.filter(
          (t) =>
            !t.visibleFact ||
            this.questFacts.includes(t.visibleFact) ||
            this.questFacts.includes(t.completedFact)
        );

        if (visibleTasks.length > 0) {
          quests.push({ ...quest, tasks: visibleTasks });
        }
      }
      return quests;
    },
  },
});
