import alt from "alt-server";
import { ServerEvents } from "@shared/events/server";
import { Quests } from "@shared/modules/quests";
import { Consumable, createItem } from "@shared/modules/items";
import { needsToBeInGame } from "@/utility/assertions";

alt.onClient(ServerEvents.FromClient.NOTIFY, (player, questFact) => {
  needsToBeInGame(player);

  switch (questFact) {
    case Quests.Introduction.Facts.GOT_INTRODUCTION:
      player.addItem(
        createItem(Consumable.SIMPLE_MEDKIT, {
          amount: 1,
        })
      );
      break;
  }
});

alt.on(ServerEvents.FromServer.USE_ITEM, (player, item) => {
  if (!player.store.isLoggedIn || !player.store.character) {
    return;
  }

  const questFacts = player.store.character.questFacts;

  if (
    item.key === Consumable.SIMPLE_MEDKIT &&
    questFacts.includes(Quests.Introduction.Facts.GOT_INTRODUCTION) &&
    !questFacts.includes(Quests.Introduction.Facts.USED_MEDKIT)
  ) {
    alt.log("QuestFact: USED_MEDKIT");
    questFacts.push(Quests.Introduction.Facts.USED_MEDKIT);
  }
});
