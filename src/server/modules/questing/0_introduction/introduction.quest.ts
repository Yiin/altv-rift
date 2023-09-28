import * as alt from "@altv/server";
import { ServerEvents } from "@shared/events/server";
import { Quests } from "@shared/modules/quests";
import { Consumable, Hatchets, createItem } from "@shared/modules/items";
import { isInGame } from "@/core/utility/assertions";
import { on } from "@/core/events/emit";

alt.Events.onPlayer(ServerEvents.FromClient.NOTIFY, (player, questFact) => {
  if (!isInGame(player)) {
    return;
  }

  switch (questFact) {
    case Quests.Introduction.Facts.GOT_INTRODUCTION: {
      player.addItem(
        createItem(Consumable.SIMPLE_MEDKIT, {
          amount: 1,
        })
      );
      break;
    }
    case Quests.Introduction.Facts.COMPLETED_WOODCUTTING: {
      player.addItem(createItem(Hatchets.HARDENED_HATCHET));
      break;
    }
  }
});

on(ServerEvents.FromServer.ITEM_USE, (player, item) => {
  const questFacts = player.character.questFacts;

  if (
    item.key === Consumable.SIMPLE_MEDKIT &&
    questFacts.includes(Quests.Introduction.Facts.GOT_INTRODUCTION) &&
    !questFacts.includes(Quests.Introduction.Facts.USED_MEDKIT)
  ) {
    questFacts.push(Quests.Introduction.Facts.USED_MEDKIT);
  }
});
