import * as alt from "@altv/server";
import { ServerEvents } from "@shared/events/server";
import { Quests } from "@shared/modules/quests";
import {
  Consumable,
  FishBait,
  FoodIngredient,
  Hatchet,
  TreeLogs,
  createItem,
} from "@shared/modules/items";
import { HatchetBlueprint } from "@shared/modules/production/blueprints/hatchet.blueprints";
import { PedKey } from "@shared/modules/ped/list";
import { FishingRodBlueprint } from "@shared/modules/production/blueprints/fishing-rod.blueprints";
import { isInGame } from "@/core/utility/assertions";
import { on } from "@/core/events/emit";

alt.Events.onPlayer(ServerEvents.FromClient.NOTIFY, (player, questFact) => {
  if (!isInGame(player)) {
    return;
  }

  switch (questFact) {
    case Quests.Introduction.Facts.GOT_INTRODUCTION: {
      if (player.isNearPed(PedKey.CAL_BURNETT)) {
        player.addItem(
          createItem(Consumable.SIMPLE_MEDKIT, {
            amount: 1,
          })
        );
      } else {
        alt.log(`${player.name} is abusing quest facts...`);
      }
      break;
    }
    case Quests.Introduction.Facts.STARTED_WOODCUTTING: {
      if (player.isNearPed(PedKey.WOODCUTTING_TUTOR)) {
        player.addItem(createItem(Hatchet.BASIC_HATCHET));
      } else {
        alt.log(`${player.name} is abusing quest facts...`);
      }
      break;
    }
    case Quests.Introduction.Facts.COMPLETED_WOODCUTTING: {
      if (
        player.isNearPed(PedKey.WOODCUTTING_TUTOR) &&
        player.removeInventoryItemByKey(
          TreeLogs.PALM_LOGS,
          Quests.Introduction.Constants.PALM_LOGS_NEEDED
        )
      ) {
        player.addBlueprint(HatchetBlueprint.ADVANCED_HATCHET);
      } else {
        alt.log(`${player.name} is abusing quest facts...`);
      }
      break;
    }
    case Quests.Introduction.Facts.STARTED_FISHING: {
      if (player.isNearPed(PedKey.FISHING_TUTOR)) {
        player.addItem(createItem(FishBait.WORMS, { amount: 500 }));
      } else {
        alt.log(`${player.name} is abusing quest facts...`);
      }
      break;
    }
    case Quests.Introduction.Facts.COMPLETED_FISHING: {
      if (
        player.isNearPed(PedKey.FISHING_TUTOR) &&
        player.removeInventoryItemByKey(
          FoodIngredient.RAW_TROUT,
          Quests.Introduction.Constants.RAW_TROUT_NEEDED
        )
      ) {
        player.addBlueprint(FishingRodBlueprint.ADVANCED_FISHING_ROD);
      } else {
        alt.log(`${player.name} is abusing quest facts...`);
      }
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
