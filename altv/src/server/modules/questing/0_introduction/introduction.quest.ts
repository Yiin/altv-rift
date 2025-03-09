import alt from "@altv/server";
import { Quests } from "@shared/modules/quests";
import {
  Consumable,
  FishingBait,
  FoodIngredient,
  ItemGrade,
  Metal,
  Ore,
  Tool,
  TreeLogs,
  createItem,
} from "@shared/modules/items";
import { AmmoBlueprint, FirearmWeaponBlueprint, ToolBlueprint } from "@shared/modules/production";
import { PedKey } from "@shared/modules/ped/list";
import { isInGame, needsToBeInGame } from "@/core/utility/assertions";
import { processQuestFact } from "../questing.hooks";
import { ServerEvents } from "@shared/events/server";
import { createStaticPed } from "@/modules/peds";
import { PedFlags } from "@shared/modules/ped";
import { dropItemOnTheGround } from "@/modules/items-manager";

// MARK: Peds
(
  [
    {
      key: PedKey.CAL_BURNETT,
      flags: PedFlags.Peaceful,
      model: "CSB_MWeather",
      name: "Cal Burnett",
      pos: new alt.Vector3({ x: 4476.591, y: -4495.673, z: 4.1902 }),
      streamingDistance: 1500,
    },
    {
      key: PedKey.DIEGO_MOREIRA,
      flags: PedFlags.Peaceful,
      model: "S_M_Y_Ranger_01",
      name: "Diego Moreira",
      pos: new alt.Vector3({ x: 5067.843, y: -4634.284, z: 2.4428231716156006 }),
      streamingDistance: 1500,
    },
    {
      key: PedKey.FISHING_TUTOR,
      flags: PedFlags.Peaceful,
      model: "A_F_Y_Yoga_01",
      name: "Grace Porter",
      pos: new alt.Vector3({ x: 4783.48876953125, y: -4751.86279296875, z: 4.855155944824219 }),
      heading: -1.138006567955017,
      streamingDistance: 1500,
    },
    {
      key: PedKey.MINING_TUTOR,
      flags: PedFlags.Peaceful,
      model: "S_M_Y_XMech_02_MP",
      name: "San Lee",
      pos: new alt.Vector3({ x: 5222.46630859375, y: -5391.2123046875, z: 67.40074157714844 }),
      heading: -2.796825647354126,
      streamingDistance: 1500,
    },
    {
      key: PedKey.WOODCUTTING_TUTOR,
      flags: PedFlags.Peaceful,
      model: "CS_JimmyBoston",
      name: "Nathan Monahan",
      pos: new alt.Vector3({ x: 5472.264, y: -5852.646, z: 20.702 }),
      heading: 96.43,
      streamingDistance: 1500,
    },
    {
      key: PedKey.CRAFTING_TUTOR,
      flags: PedFlags.Peaceful,
      model: "S_F_M_Autoshop_01",
      name: "Sara Matthews",
      pos: new alt.Vector3({ x: 5329.0419921875, y: -5270.0439453125, z: 33.172119140625 }),
      heading: 2.226325511932373,
      streamingDistance: 1500,
    },
  ] as Parameters<typeof createStaticPed>[0][]
).map(({ key, model, pos, heading, ...meta }) =>
  createStaticPed({ key, model, pos, heading: heading ?? 0, ...meta }),
);

// MARK: Quest Facts
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
          { dropOnFail: true },
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
        player.addItem(createItem(Tool.HATCHET));
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
          TreeLogs.COMMON_TREE_LOGS,
          Quests.Introduction.Constants.PALM_LOGS_NEEDED,
        )
      ) {
        player.addBlueprint(ToolBlueprint.HATCHET);
        player.character.skills.woodcutting.exp += 1000;
        return true;
      } else {
        reportAbuse(player, questFact);
      }
      break;
    }
    // MARK: Fishing start
    case Quests.Introduction.Facts.STARTED_FISHING: {
      if (player.isNearPed(PedKey.FISHING_TUTOR)) {
        player.addItem(createItem(Tool.FISHING_ROD, { grade: ItemGrade.COMMON }), {
          dropOnFail: true,
        });
        player.addItem(createItem(FishingBait.WORMS, { amount: 100 }), { dropOnFail: true });
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
        player.addItem(createItem(FishingBait.WORMS, { amount: 300 }), { dropOnFail: true });
        player.character.skills.fishing.exp += 1000;
        return true;
      } else {
        reportAbuse(player, questFact);
      }
    }
    // MARK: Mining start
    case Quests.Introduction.Facts.STARTED_MINING: {
      if (player.isNearPed(PedKey.MINING_TUTOR)) {
        player.addItem(createItem(Tool.PICKAXE, { grade: ItemGrade.COMMON }), { dropOnFail: true });
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
          key: Metal.COMMON_METAL,
          amount: Quests.Introduction.Constants.IRON_ORE_NEEDED,
        })
      ) {
        player.addBlueprint(ToolBlueprint.PICKAXE);
        player.character.skills.mining.exp += 1000;
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
      if (
        player.isNearPed(PedKey.DIEGO_MOREIRA) &&
        [
          Quests.Introduction.Facts.COMPLETED_CRAFTING,
          Quests.Introduction.Facts.COMPLETED_FISHING,
          Quests.Introduction.Facts.COMPLETED_WOODCUTTING,
          Quests.Introduction.Facts.COMPLETED_MINING_AND_SMITHING,
        ].every((fact) => questFacts.includes(fact))
      ) {
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
