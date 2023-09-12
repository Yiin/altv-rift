import * as alt from "@altv/server";
import { Quests } from "@shared/modules/quests";
import { ServerEventsFromClient } from "@shared/events/server/from-client";
import { isInGame } from "@/utility/assertions";

const allQuestFacts = Object.values(Quests).flatMap((quest) => Object.values<string>(quest.Facts));

alt.Events.onPlayer(ServerEventsFromClient.NOTIFY, (player, questFact) => {
  if (!isInGame(player)) {
    return;
  }

  if (allQuestFacts.includes(questFact)) {
    if (!player.character.questFacts.includes(questFact)) {
      alt.log("Adding quest fact", questFact);
      player.character.questFacts.push(questFact);

      // player.saveCharacter();
    }
  }
});
