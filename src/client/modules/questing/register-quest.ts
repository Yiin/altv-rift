import { QuestRegistration } from "@shared/store/client.store";
import { clientStore } from "@/store/client.store";

export function registerQuest(key: string, data: QuestRegistration) {
  clientStore.quests.set(key, data);
}

export function getQuest(key: string) {
  clientStore.quests.get(key);
}
