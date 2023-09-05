import { QuestRegistration } from "@shared/store/client.store";
import { clientState } from "@/store/client.store";

export function registerQuest(key: string, data: QuestRegistration) {
  clientState.quests.set(key, data);
}

export function getQuest(key: string) {
  clientState.quests.get(key);
}
