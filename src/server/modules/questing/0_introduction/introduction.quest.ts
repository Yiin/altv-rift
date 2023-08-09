import alt from "alt-server";
import { ServerEvents } from "@shared/events/server";
import { Quests } from "@shared/modules/quests";

alt.onClient(ServerEvents.FromClient.NOTIFY, (player, questFact) => {
  if (!player.store.isLoggedIn) {
    return;
  }

  switch (questFact) {
    case Quests.Introduction.Facts.GOT_INTRODUCTION:
      player.addItem("simple_medkit", {
        amount: 1,
      });
      break;
  }
});

alt.on(ServerEvents.FromServer.USE_ITEM, (player, item) => {
  if (!player.store.isLoggedIn || !player.store.character) {
    return;
  }

  const questFacts = player.store.character.questFacts;

  if (
    item.data.key === "simple_medkit" &&
    questFacts.includes(Quests.Introduction.Facts.GOT_INTRODUCTION) &&
    !questFacts.includes(Quests.Introduction.Facts.USED_MEDKIT)
  ) {
    alt.log("QuestFact: USED_MEDKIT");
    questFacts.push(Quests.Introduction.Facts.USED_MEDKIT);
  }
});
