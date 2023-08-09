import { defineStore } from "pinia";
import {
  getDefaultClientStoreState,
  QuestRegistration,
} from "@shared/store/client.store";
import { usePlayerStore } from "@shared/store/player.store";

export const useClient = defineStore("client", {
  state: getDefaultClientStoreState,
  getters: {
    activeQuests(state) {
      const questFacts = usePlayerStore().character?.questFacts ?? [];
      const quests: QuestRegistration[] = [];

      for (const quest of state.quests.values()) {
        const hasVisibleTasks = quest.tasks.some(
          (t) =>
            !t.visibleFact ||
            questFacts.includes(t.visibleFact) ||
            questFacts.includes(t.completedFact)
        );

        if (hasVisibleTasks) {
          quests.push(quest);
        }
      }
      return quests;
    },
  },
});
