import alt from "@altv/server";
import { Quests } from "@shared/modules/quests";
import { ServerEvents } from "@shared/events/server";
import { isInGame } from "@/core/utility/assertions";
import { processQuestFact } from "./questing.hooks";

const allQuestFacts = Object.values(Quests).flatMap((quest) => Object.values<string>(quest.Facts));

alt.Events.onPlayer(ServerEvents.FromClient.REGISTER_QUEST_FACT, (player, questFact) => {
  if (!isInGame(player)) {
    return;
  }

  if (allQuestFacts.includes(questFact)) {
    if (!player.character.questFacts.includes(questFact)) {
      const success = processQuestFact.call(player, questFact);

      if (success) {
        player.character.questFacts.push(questFact);
        player.saveCharacter();
      }
    }
  }
});
