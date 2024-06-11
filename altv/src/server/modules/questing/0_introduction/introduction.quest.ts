import alt from "@altv/server";
import { Quests } from "@shared/modules/quests";
import {
  Consumable,
  FishBait,
  FishingRod,
  FoodIngredient,
  Hatchet,
  ItemGrade,
  Metal,
  Ore,
  Pickaxe,
  TreeLogs,
  createItem,
} from "@shared/modules/items";
import { AmmoBlueprint, FirearmWeaponBlueprint, ToolBlueprint } from "@shared/modules/production";
import { PedKey } from "@shared/modules/ped/list";
import { isInGame, needsToBeInGame } from "@/core/utility/assertions";
import { processQuestFact } from "../questing.hooks";
import { ServerEvents } from "@shared/events/server";

processQuestFact.hook((player, questFact) => {
  if (!isInGame(player)) {
    return;
  }

  const questFacts = player.character.questFacts;

  switch (questFact) {
    // MARK: Got introduction
    case Quests.Introduction.Facts.GOT_INTRODUCTION: {
      if (player.isNearPed(PedKey.CAL_BURNETT)) {
        player.addItem(
          createItem(Consumable.SIMPLE_MEDKIT, {
            amount: 3,
          }),
        );
        player.character.money += 500;
        return true;
      } else {
        reportAbuse(player, questFact);
      }
      break;
    }
    // MARK: Opened inventory
    case Quests.Introduction.Facts.OPEN_INVENTORY: {
      return true;
    }
    // MARK: Turn on engine
    case Quests.Introduction.Facts.TURN_ON_ENGINE: {
      if (player.vehicle) {
        return true;
      }
    }
    // MARK: Talked with diego
    case Quests.Introduction.Facts.TALKED_WITH_DIEGO: {
      if (player.isNearPed(PedKey.DIEGO_MOREIRA)) {
        return true;
      }
    }
    // MARK: Woodcutting start
    case Quests.Introduction.Facts.STARTED_WOODCUTTING: {
      if (player.isNearPed(PedKey.WOODCUTTING_TUTOR)) {
        player.addItem(createItem(Hatchet.HATCHET));
        return true;
      } else {
        reportAbuse(player, questFact);
      }
      break;
    }
    // MARK: Woodcutting complete
    case Quests.Introduction.Facts.COMPLETED_WOODCUTTING: {
      if (
        player.isNearPed(PedKey.WOODCUTTING_TUTOR) &&
        player.removeInventoryItemByKey(
          TreeLogs.PALM_LOGS,
          Quests.Introduction.Constants.PALM_LOGS_NEEDED,
        )
      ) {
        player.addBlueprint(ToolBlueprint.HATCHET);
        player.character.skills.woodcutting += 1000;
        return true;
      } else {
        reportAbuse(player, questFact);
      }
      break;
    }
    // MARK: Fishing start
    case Quests.Introduction.Facts.STARTED_FISHING: {
      if (player.isNearPed(PedKey.FISHING_TUTOR)) {
        player.addItem(createItem(FishingRod.FISHING_ROD, { grade: ItemGrade.COMMON }));
        player.addItem(createItem(FishBait.WORMS, { amount: 100 }));
        return true;
      } else {
        reportAbuse(player, questFact);
      }
      break;
    }
    // MARK: Fishing complete
    case Quests.Introduction.Facts.COMPLETED_FISHING: {
      if (
        player.isNearPed(PedKey.FISHING_TUTOR) &&
        player.removeInventoryItemByKey(
          FoodIngredient.RAW_TROUT,
          Quests.Introduction.Constants.RAW_TROUT_NEEDED,
        )
      ) {
        player.addBlueprint(ToolBlueprint.FISHING_ROD);
        player.addItem(createItem(FishBait.WORMS, { amount: 300 }));
        player.character.skills.fishing += 1000;
        return true;
      } else {
        reportAbuse(player, questFact);
      }
    }
    // MARK: Mining start
    case Quests.Introduction.Facts.STARTED_MINING: {
      if (player.isNearPed(PedKey.MINING_TUTOR)) {
        player.addItem(createItem(Pickaxe.PICKAXE, { grade: ItemGrade.COMMON }));
        return true;
      }
    }
    // MARK: Smithing 
    case Quests.Introduction.Facts.COMPLETED_MINING_STARTED_SMITHING: {
      if (
        player.isNearPed(PedKey.MINING_TUTOR) &&
        player.hasItem({
          key: Ore.IRON_ORE,
          amount: Quests.Introduction.Constants.IRON_ORE_NEEDED,
        })
      ) {
        return true;
      } else {
        reportAbuse(player, questFact);
      }
    }
    // MARK: Mining complete
    case Quests.Introduction.Facts.COMPLETED_MINING_AND_SMITHING: {
      if (
        player.isNearPed(PedKey.MINING_TUTOR) &&
        player.hasItem({
          key: Metal.METAL,
          grade: ItemGrade.COMMON,
          amount: Quests.Introduction.Constants.IRON_ORE_NEEDED,
        })
      ) {
        player.addBlueprint(ToolBlueprint.PICKAXE);
        player.character.skills.mining += 1000;
        return true;
      } else {
        reportAbuse(player, questFact);
      }
    }
    // MARK: Crafting start
    case Quests.Introduction.Facts.STARTED_CRAFTING: {
      if (player.isNearPed(PedKey.CRAFTING_TUTOR)) {
        player.addBlueprint(AmmoBlueprint.HANDGUN_AMMO);
        return true;
      } else {
        reportAbuse(player, questFact);
      }
    }
    // MARK: Crafting complete
    case Quests.Introduction.Facts.COMPLETED_CRAFTING: {
      if (player.isNearPed(PedKey.CRAFTING_TUTOR)) {
        player.addBlueprint(FirearmWeaponBlueprint.PISTOL);
        return true;
      } else {
        reportAbuse(player, questFact);
      }
    }
    // MARK: Completed all
    case Quests.Introduction.Facts.COMPLETED_ALL: {
      if (player.isNearPed(PedKey.DIEGO_MOREIRA) && [
        Quests.Introduction.Facts.COMPLETED_CRAFTING,
        Quests.Introduction.Facts.COMPLETED_FISHING,
        Quests.Introduction.Facts.COMPLETED_WOODCUTTING,
        Quests.Introduction.Facts.COMPLETED_MINING_AND_SMITHING,
      ].every((fact) => questFacts.includes(fact))) {
        return true;
      } else {
        reportAbuse(player, questFact);
      }
    }
  }
  return;
});

alt.Events.onPlayer(ServerEvents.FromClient.GET_RATBIKE, (player) => {
  needsToBeInGame(player);

  const questFacts = player.character.questFacts;

  // MARK: Get ratbike
  if (!questFacts.includes(Quests.Introduction.Facts.GOT_RATBIKE)) {
    questFacts.push(Quests.Introduction.Facts.GOT_RATBIKE);

    alt.Timers.setTimeout(() => {
      questFacts.push(Quests.Introduction.Facts.TURN_ON_ENGINE);
    }, 3000);
  }
});

function reportAbuse(player: alt.Player, questFact: string) {
  alt.log(`${player.name} is abusing quest facts:`, questFact);
}
