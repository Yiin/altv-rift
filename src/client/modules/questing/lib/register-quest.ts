import { QuestInfo, QuestTaskInfo } from "@shared/store/client.store";
import { Override } from "@shared/interfaces";
import { clientState } from "@/core/store/client.store";

type QuestTask = Override<
  QuestTaskInfo,
  {
    track?(): void | (() => void);
  }
>;

type Quest = QuestInfo & {
  tasks: QuestTask[];
};

export const quests = new Map<string, Quest>();

export function registerQuest(key: string, quest: Quest) {
  quests.set(key, quest);
  clientState.quests.set(key, quest);
}

export function getQuest(key: string) {
  quests.get(key);
}

export function getQuestTask(fact: string) {
  for (const quest of quests.values()) {
    for (const task of quest.tasks) {
      if (task.completedFact === fact) {
        return task;
      }
    }
  }
  return null;
}
