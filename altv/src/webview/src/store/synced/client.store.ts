import { defineStore } from "pinia";
import { WindowType, getDefaultClientStoreState, type QuestInfo } from "@shared/store/client.store";
import { ClientEvents } from "@shared/events/client";
import { StorageType } from "@shared/store/game-state.store";
import { useCharacter } from "./character.store";
import { useGameState } from "./game-state.store";

export const useClient = defineStore("client", {
  state: getDefaultClientStoreState,
  getters: {
    questFacts() {
      return (
        useCharacter()?.questFacts ?? [
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
      const quests: QuestInfo[] = [];

      for (const quest of state.quests.values()) {
        const visibleTasks = quest.tasks.filter(
          (t) =>
            !t.visibleFact ||
            this.questFacts.includes(t.visibleFact) ||
            this.questFacts.includes(t.completedFact),
        );

        if (visibleTasks.length > 0) {
          quests.push({ ...quest, tasks: visibleTasks });
        }
      }
      return quests;
    },
    droppedItems(state) {
      return state.nearbyItems.map((item, index) => ({
        ...item,
        inventorySlot: index,
      }));
    },
  },
  actions: {
    closeWindow() {
      alt.emit(ClientEvents.FromWebview.CLOSE_WINDOW);
    },
  },
});
