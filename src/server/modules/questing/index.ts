import alt from "alt-server";
import { ServerEvents } from "@shared/events/server";
import { Quests } from "@shared/modules/quests";

// @index('./**/*.quest.ts', f => `import "${f.path}";`)
import "./0_introduction/introduction.quest";
// @endindex

const allQuestFacts = Object.values(Quests).flatMap((quest) => Object.values<string>(quest.Facts));

alt.onClient(ServerEvents.FromClient.NOTIFY, (player, questFact) => {
  if (!player.store.isLoggedIn) {
    return;
  }

  if (allQuestFacts.includes(questFact)) {
    if (!player.store.character.questFacts.includes(questFact)) {
      alt.log("Adding quest fact", questFact);
      player.store.character.questFacts.push(questFact);

      // player.saveCharacter();
    }
  }
});
