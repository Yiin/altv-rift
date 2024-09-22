import alt from "@altv/client";
import { PedKey } from "@shared/modules/ped/list";
import { Quests } from "@shared/modules/quests";
import { ServerEvents } from "@shared/events/server";
import { PedInteraction } from "@shared/modules/ped/interactions";
import { getInventoryItem, getInventoryItemByKey } from "@shared/modules/inventory";
import { Ammo, AmmoItem, FoodIngredient, ItemGrade, Metal, MetalItem, Ore, TreeLogs } from "@shared/modules/items";
import { IconName } from "@/core/rmlui/components/icon";
import { useCharacter } from "@/core/store/character.store";
import { registerQuest } from "../../lib/register-quest";
import { registerPedInteractions } from "../../lib/register-ped-interactions";
import { startConversation } from "../../conversation";
import { whileInGame } from "@/core/game-state-hooks/in-game.state";
import { watch } from "vue";
import { clientState } from "@/core/store/client.store";
import { WindowType } from "@shared/store/client.store";

// MARK: Quest log

registerQuest(Quests.Introduction.Key, {
  name: "Introduction",
  summary: "An introduction to the game",
  tasks: [
    {
      completedFact: Quests.Introduction.Facts.GOT_INTRODUCTION,
      title: "Get introduction",
      summary: `I've just survived an emergency plane landing on Cayo Perico. I should probably talk with someone to figure out the current situation on the ground.`,
      hints: ["Talk with Cal Burnett"],
      track() {
        return;
      },
    },
    {
      visibleFact: Quests.Introduction.Facts.GOT_INTRODUCTION,
      completedFact: Quests.Introduction.Facts.OPEN_INVENTORY,
      title: "Open inventory",
      summary: `I've received a med kit and some cash. I should use the supplies in the kit to patch up my wounds and counteract the dizziness I'm feeling.`,
      hints: ["Press B to open the inventory and double click the medkit"],
    },
    {
      visibleFact: Quests.Introduction.Facts.OPEN_INVENTORY,
      completedFact: Quests.Introduction.Facts.GOT_RATBIKE,
      title: "Pick up a bike",
      summary: "Cal mentioned that I can find a a guy in the garage that would provide me with a bike to get around the island.",
      hints: ["Talk with John Wick in the hangar"],
    },
    {
      visibleFact: Quests.Introduction.Facts.GOT_RATBIKE,
      completedFact: Quests.Introduction.Facts.TURN_ON_ENGINE,
      title: "Turn on the engine",
      summary: "This bike requires some improvisation to get it going",
      hints: ["Press H to turn on the engine"],
    },
    {
      visibleFact: Quests.Introduction.Facts.TURN_ON_ENGINE,
      completedFact: Quests.Introduction.Facts.TALKED_WITH_DIEGO,
      title: "Find Diego Moreira",
      summary: "Cal suggested me to find and talk to Diego Moreira, a cop in charge. He is usually at the entrance of the North Dock.",
    },
    {
      visibleFact: Quests.Introduction.Facts.TALKED_WITH_DIEGO,
      completedFact: Quests.Introduction.Facts.STARTED_MINING,
      title: "Help with materials",
      summary: "I need to talk with San-Lee to help in the mines.",
    },
    {
      visibleFact: Quests.Introduction.Facts.STARTED_MINING,
      completedFact: Quests.Introduction.Facts.COMPLETED_MINING_STARTED_SMITHING,
      title: "Mining",
      summary: `Mine ${Quests.Introduction.Constants.IRON_ORE_NEEDED} iron ores and bring them back to San-Lee.`,
      hints: [
        "You can mine ores by clicking LMB near them",
      ]
    },
    {
      visibleFact: Quests.Introduction.Facts.COMPLETED_MINING_STARTED_SMITHING,
      completedFact: Quests.Introduction.Facts.COMPLETED_MINING_AND_SMITHING,
      title: "Smithing",
      summary: `Process ${Quests.Introduction.Constants.IRON_ORE_NEEDED} iron ores into metal in nearby forge.`,
    },
    {
      visibleFact: Quests.Introduction.Facts.TALKED_WITH_DIEGO,
      completedFact: Quests.Introduction.Facts.STARTED_FISHING,
      title: "Do some fishing",
      summary: "I should go to Grace for fishing help.",
    },
    {
      visibleFact: Quests.Introduction.Facts.STARTED_FISHING,
      completedFact: Quests.Introduction.Facts.COMPLETED_FISHING,
      title: "Fishing",
      summary: `Catch ${Quests.Introduction.Constants.RAW_TROUT_NEEDED} trouts and deliver them to Grace.`,
      hints: [
        "Equip the fishing rod by double clicking on it.",
        "Use worms by clicking on them and then clicking on fishing rod.",
        "You can start fishing by pressing ALT near the water to open actions menu."
      ],
    },
    {
      visibleFact: Quests.Introduction.Facts.TALKED_WITH_DIEGO,
      completedFact: Quests.Introduction.Facts.STARTED_WOODCUTTING,
      title: "Forestry",
      summary: "Nathan will give me the introduction to woodcutting.",
    },
    {
      visibleFact: Quests.Introduction.Facts.STARTED_WOODCUTTING,
      completedFact: Quests.Introduction.Facts.COMPLETED_WOODCUTTING,
      title: "Woodcutting",
      summary: `Chop ${Quests.Introduction.Constants.PALM_LOGS_NEEDED} palm trees and bring them back to Nathan.`,
      hints: [
        "You can chop trees by clicking LMB near them",
      ],
    },
    {
      visibleFact: Quests.Introduction.Facts.TALKED_WITH_DIEGO,
      completedFact: Quests.Introduction.Facts.STARTED_CRAFTING,
      title: "Craftmanship",
      summary: "To help with crafting, I should go see Sara.",
    },
    {
      visibleFact: Quests.Introduction.Facts.STARTED_CRAFTING,
      completedFact: Quests.Introduction.Facts.COMPLETED_CRAFTING,
      title: "Crafting",
      summary: `Craft ${Quests.Introduction.Constants.HANDGUN_AMMO_NEEDED} handgun ammo and bring them back to Sara.`,
      hints: [
        "You can open crafting menu by pressing L.",
      ]
    },
    {
      visibleFact: Quests.Introduction.Facts.COMPLETED_ALL,
      completedFact: Quests.Introduction.Facts.COMPLETED_ALL,
      title: "Determination",
      summary: "I don't play around.",
    },
  ],
});

// MARK: Cal Burnett
registerPedInteractions(PedKey.CAL_BURNETT, (ped) => {
  const interactions: PedInteraction<IconName>[] = [];

  const questFacts = useCharacter().questFacts ?? [];

  if (!questFacts.includes(Quests.Introduction.Facts.GOT_INTRODUCTION)) {
    // Gives introduction
    interactions.push({
      key: Quests.Introduction.Facts.GOT_INTRODUCTION,
      icon: "quest",
      label: "Talk",
      onSelect() {
        startConversation(ped, {
          pages: [
            "Uh-huh, you awake? Barely surviving that landing is a miracle on its own.",
            "So, get yourself together. Here, take this. Trust me, that tin can airplane did you no favors. There are bandages, antiseptics, what-have-you. Get yourself sorted, we can talk more after.",
            "And listen, once you're patched up, head over to the garage. There's a guy named John Wick. He hands out motorbikes—old, rusty, but they get the job done. Tell him I sent you.",
          ],
          topic: "Introduction",
          options: [
            { value: "accept", label: "Accept medicine", color: "primary" },
            { label: "Cancel" },
          ],
        }).then((option) => {
          if (option?.value === "accept") {
            alt.Events.emitServerRaw(
              ServerEvents.FromClient.REGISTER_QUEST_FACT,
              Quests.Introduction.Facts.GOT_INTRODUCTION,
            );
          }
        });
      },
    });
  }

  return interactions;
});

// MARK: John Wick
registerPedInteractions(PedKey.JOHN_WICK, (ped) => {
  const interactions: PedInteraction<IconName>[] = [];

  const questFacts = useCharacter().questFacts ?? [];

  if (
    questFacts.includes(Quests.Introduction.Facts.OPEN_INVENTORY) &&
    !questFacts.includes(Quests.Introduction.Facts.GOT_RATBIKE)
  ) {
    interactions.push({
      key: Quests.Introduction.Facts.GOT_RATBIKE,
      icon: "quest",
      label: "Talk",
      onSelect() {
        startConversation(ped, {
          pages: [
            "Hey, I heard you were coming. Name's John Wick. I've got a stash of motorbikes I collect from around the island and repair in my workshop. Whenever you need one, just swing by and take your pick.",
          ],
          topic: "Ratbikes",
          options: [
            { value: "accept", label: "Get ratbike", color: "primary" },
            { label: "Cancel", }
          ]
        }).then((option) => {
          alt.Events.emitServerRaw(
            ServerEvents.FromClient.REGISTER_QUEST_FACT,
            Quests.Introduction.Facts.GOT_RATBIKE,
          );
          if (option?.value === "accept") {
            alt.Events.emitServerRaw(ServerEvents.FromClient.GET_RATBIKE);
          }
        });
      }
    });
  }

  return interactions;
});

// MARK: Diego Moreira
registerPedInteractions(PedKey.DIEGO_MOREIRA, (ped) => {
  const interactions: PedInteraction<IconName>[] = [];

  const questFacts = useCharacter().questFacts ?? [];

  const needsIntro =
    questFacts.includes(Quests.Introduction.Facts.TURN_ON_ENGINE) &&
    !questFacts.includes(Quests.Introduction.Facts.TALKED_WITH_DIEGO);

  if (needsIntro) {
    interactions.push({
      key: Quests.Introduction.Facts.TALKED_WITH_DIEGO,
      icon: "quest",
      label: "Talk",
      onSelect() {
        startConversation(ped, {
          topic: "Introduction",
          pages: [
            "Cal, of course... Anyways, since you're here, we've got work to be done, no time to sit around",
            "Here are your assignments. Each job includes making a delivery at the end.",
          ],
        }).then(() => {
          alt.Events.emitServerRaw(
            ServerEvents.FromClient.REGISTER_QUEST_FACT,
            Quests.Introduction.Facts.TALKED_WITH_DIEGO,
          );
        });
      },
    });
  } else {
    const completedAllTasks = [
      Quests.Introduction.Facts.COMPLETED_MINING_AND_SMITHING,
      Quests.Introduction.Facts.COMPLETED_FISHING,
      Quests.Introduction.Facts.COMPLETED_WOODCUTTING,
      Quests.Introduction.Facts.COMPLETED_CRAFTING,
    ].every((fact) => questFacts.includes(fact));

    const gotRecognition = questFacts.includes(Quests.Introduction.Facts.COMPLETED_ALL);

    if (!needsIntro && completedAllTasks && !gotRecognition) {
      interactions.push({
        key: Quests.Introduction.Facts.COMPLETED_ALL,
        icon: "quest",
        label: "Talk",
        onSelect() {
          startConversation(ped, {
            topic: "Introduction",
            pages: [
              "All done, are ya? Not many are as diligent. That’s good. That’s what keeps us alive here.",
              "I've heard from them all — Lee, Grace, Nathan, and Sara. They say you’ve done well. Not just well, exceptional. Mining, fishing, woodcutting, crafting... you've proven yourself in all areas.",
              "As a token of appreciation for your hard work, take this. It’s an island secret, these herbs. They sharpen your senses and give you a boost, increase your learning experience for a short time. Use them wisely.",
            ],
            options: [
              { value: "complete", label: "Complete", color: "primary" },
              { label: "Cancel" },
            ],
          }).then(() => {
            alt.Events.emitServerRaw(
              ServerEvents.FromClient.REGISTER_QUEST_FACT,
              Quests.Introduction.Facts.COMPLETED_ALL,
            );
          });
        },
      });
    }
  }

  return interactions;
});

// MARK: Fishing tutor
registerPedInteractions(PedKey.FISHING_TUTOR, (ped) => {
  const interactions: PedInteraction<IconName>[] = [];

  const questFacts = useCharacter().questFacts ?? [];

  if (
    questFacts.includes(Quests.Introduction.Facts.TALKED_WITH_DIEGO) &&
    !questFacts.includes(Quests.Introduction.Facts.STARTED_FISHING)
  ) {
    interactions.push({
      key: Quests.Introduction.Facts.STARTED_FISHING,
      icon: "quest",
      label: "Talk",
      onSelect() {
        startConversation(ped, {
          topic: "Introduction",
          pages: [
            "Diego sent you down, did he? Well, I'm guessing it wasn't just to admire the view.",
            `There you go then. ${Quests.Introduction.Constants.RAW_TROUT_NEEDED}. That's your quota. Sounds like a lot, but the sea's generous today.`,
            "Here's a tip: patience is key. And remember, every catch, no matter how small, makes a difference.",
          ],
          options: [{ value: "accept", label: "Accept", color: "primary" }],
        }).then((option) => {
          if (option?.value === "accept") {
            alt.Events.emitServerRaw(
              ServerEvents.FromClient.REGISTER_QUEST_FACT,
              Quests.Introduction.Facts.STARTED_FISHING,
            );
          }
        });
      },
    });
  }

  if (
    questFacts.includes(Quests.Introduction.Facts.STARTED_FISHING) &&
    !questFacts.includes(Quests.Introduction.Facts.COMPLETED_FISHING)
  ) {
    const rawTrouts = getInventoryItemByKey(useCharacter().inventory, FoodIngredient.RAW_TROUT);

    if (rawTrouts && rawTrouts.item.amount >= Quests.Introduction.Constants.RAW_TROUT_NEEDED) {
      interactions.push({
        key: Quests.Introduction.Facts.COMPLETED_FISHING,
        icon: "quest",
        label: "Talk",
        onSelect() {
          startConversation(ped, {
            topic: "Introduction",
            pages: [
              "Fifty fish, just as asked. Impressive work. Here, take this. It's a blueprint for a fishing rod—one of the best you'll find. And some worms for bait, of course. You've earned it.",
              "Keep at it, and you'll be a master in no time. Remember, the sea rewards those who respect it.",
            ],
            options: [{ value: "complete", label: "Complete", color: "primary" }],
          }).then((option) => {
            if (option?.value === "complete") {
              alt.Events.emitServerRaw(
                ServerEvents.FromClient.REGISTER_QUEST_FACT,
                Quests.Introduction.Facts.COMPLETED_FISHING,
              );
            }
          });
        },
      });
    }
  }

  return interactions;
});

// MARK: Mining tutor
registerPedInteractions(PedKey.MINING_TUTOR, (ped) => {
  const interactions: PedInteraction<IconName>[] = [];

  const questFacts = useCharacter().questFacts ?? [];

  if (
    questFacts.includes(Quests.Introduction.Facts.TALKED_WITH_DIEGO) &&
    !questFacts.includes(Quests.Introduction.Facts.STARTED_MINING)
  ) {
    interactions.push({
      key: Quests.Introduction.Facts.STARTED_MINING,
      icon: "quest",
      label: "Talk",
      onSelect() {
        startConversation(ped, {
          topic: "Introduction",
          pages: [
            "Diego sent you, huh? Looks like I've become the welcoming committee for new blood,",
            "Here's the thing, mining isn't a walk in the park. This ain't about playing in the dirt. It's grimy, it's sweaty, and it's a hell lot of hard work. You have to work and bleed, sometimes literally, to reap any reward.",
            `But if you're up for it, grab a pickaxe and head into the caves. I need you to mine ${Quests.Introduction.Constants.IRON_ORE_NEEDED} iron ores. It's not going to be easy, but nothing worthwhile ever is. Bring them back here, and we'll see what you're really made of.`,
          ],
          options: [{ value: "accept", label: "Accept", color: "primary" }],
        }).then((option) => {
          if (option?.value === "accept") {
            alt.Events.emitServerRaw(
              ServerEvents.FromClient.REGISTER_QUEST_FACT,
              Quests.Introduction.Facts.STARTED_MINING,
            );
          }
        });
      },
    });
  }

  if (
    questFacts.includes(Quests.Introduction.Facts.STARTED_MINING) &&
    !questFacts.includes(Quests.Introduction.Facts.COMPLETED_MINING_STARTED_SMITHING)
  ) {
    const ironOre = getInventoryItemByKey(useCharacter().inventory, Ore.IRON_ORE);

    if (ironOre && ironOre.item.amount >= Quests.Introduction.Constants.IRON_ORE_NEEDED) {
      interactions.push({
        key: Quests.Introduction.Facts.COMPLETED_MINING_STARTED_SMITHING,
        icon: "quest",
        label: "Talk",
        onSelect() {
          startConversation(ped, {
            topic: "Introduction",
            pages: [
              `Well done, you actually got the ${Quests.Introduction.Constants.IRON_ORE_NEEDED} iron ores.`,
              "Now, take them to the nearby forge and process them into metal—show me you can handle the whole process."
            ],
            options: [{ value: "accept", label: "Accept", color: "primary" }],
          }).then((option) => {
            if (option?.value === "accept") {
              alt.Events.emitServerRaw(
                ServerEvents.FromClient.REGISTER_QUEST_FACT,
                Quests.Introduction.Facts.COMPLETED_MINING_STARTED_SMITHING,
              );
            }
          });
        },
      });
    }
  }

  if (
    questFacts.includes(Quests.Introduction.Facts.COMPLETED_MINING_STARTED_SMITHING) &&
    !questFacts.includes(Quests.Introduction.Facts.COMPLETED_MINING_AND_SMITHING)
  ) {
    const metal = getInventoryItemByKey(useCharacter().inventory, Metal.COMMON_METAL);

    if (metal && metal.item.amount >= Quests.Introduction.Constants.IRON_ORE_NEEDED) {
      interactions.push({
        key: Quests.Introduction.Facts.COMPLETED_MINING_AND_SMITHING,
        icon: "quest",
        label: "Talk",
        onSelect() {
          startConversation(ped, {
            topic: "Introduction",
            pages: [
              "Impressive work, turning those ores into metal. You're proving your worth.",
              "Here, take this pickaxe blueprint as a reward. It'll serve you well in the mines. Keep it up, and you'll go far.",
            ],
            options: [{ value: "complete", label: "Complete", color: "primary" }],
          }).then((option) => {
            if (option?.value === "complete") {
              alt.Events.emitServerRaw(
                ServerEvents.FromClient.REGISTER_QUEST_FACT,
                Quests.Introduction.Facts.COMPLETED_MINING_AND_SMITHING,
              );
            }
          });
        }
      })
    }
  }

  return interactions;
});

// MARK: Woodcutting tutor
registerPedInteractions(PedKey.WOODCUTTING_TUTOR, (ped) => {
  const interactions: PedInteraction<IconName>[] = [];

  const questFacts = useCharacter().questFacts ?? [];

  if (
    questFacts.includes(Quests.Introduction.Facts.TALKED_WITH_DIEGO) &&
    !questFacts.includes(Quests.Introduction.Facts.STARTED_WOODCUTTING)
  ) {
    interactions.push({
      key: Quests.Introduction.Facts.STARTED_WOODCUTTING,
      icon: "quest",
      label: "Talk",
      onSelect() {
        startConversation(ped, {
          topic: "Introduction",
          pages: [
            "So Diego sent you my way. About time. Thought I'd be stuck felling these palms alone.",
            "Take this hatchet, there's plenty of trees here to keep us busy, and plenty of work for you.",
            `That's to keep the fires alive and warm, and to build shelters. New guy's job is to cut ${Quests.Introduction.Constants.PALM_LOGS_NEEDED} palm logs. No pressure,`,
            "Remember, it ain't just about being hard on the tree. You gotta be smart with your axe—the angle, a good swing, and gravity does the rest. And don't be fazed by the blisters. They go away—in time.",
          ],
          options: [{ value: "accept", label: "Accept", color: "primary" }],
        }).then((option) => {
          if (option?.value === "accept") {
            alt.Events.emitServerRaw(
              ServerEvents.FromClient.REGISTER_QUEST_FACT,
              Quests.Introduction.Facts.STARTED_WOODCUTTING,
            );
          }
        });
      },
    });
  }

  if (
    questFacts.includes(Quests.Introduction.Facts.STARTED_WOODCUTTING) &&
    !questFacts.includes(Quests.Introduction.Facts.COMPLETED_WOODCUTTING)
  ) {
    const palmLogs = getInventoryItemByKey(useCharacter().inventory, TreeLogs.COMMON_TREE_LOGS);

    if (palmLogs && palmLogs.item.amount >= Quests.Introduction.Constants.PALM_LOGS_NEEDED) {
      interactions.push({
        key: Quests.Introduction.Facts.COMPLETED_WOODCUTTING,
        icon: "quest",
        label: "Talk",
        onSelect() {
          startConversation(ped, {
            topic: "Introduction",
            pages: [
              "Didn't expect you to bring back so much, but you've clearly got it in you, a lot of people underestimate the work we do, a lot of people wouldn't last a day doing what you just did.",
              "Looks like you could use a tool of your own. Here, it's yours. Consider it a token of earned respect. It ain't no showpiece but trust me, it's more about the hands that wield it than the tool itself.",
            ],
            options: [{ value: "complete", label: "Complete", color: "primary" }],
          }).then((option) => {
            if (option?.value === "complete") {
              alt.Events.emitServerRaw(
                ServerEvents.FromClient.REGISTER_QUEST_FACT,
                Quests.Introduction.Facts.COMPLETED_WOODCUTTING,
              );
            }
          });
        },
      });
    }
  }

  return interactions;
});

// MARK: Crafting tutor
registerPedInteractions(PedKey.CRAFTING_TUTOR, (ped) => {
  const interactions: PedInteraction<IconName>[] = [];

  const questFacts = useCharacter().questFacts ?? [];

  if (
    questFacts.includes(Quests.Introduction.Facts.TALKED_WITH_DIEGO) &&
    !questFacts.includes(Quests.Introduction.Facts.STARTED_CRAFTING)
  ) {
    interactions.push({
      key: Quests.Introduction.Facts.STARTED_CRAFTING,
      icon: "quest",
      label: "Talk",
      onSelect() {
        startConversation(ped, {
          topic: "Introduction",
          pages: [
            "Diego sent you, huh? Well, don't just stand there like a rusty nail. Look like you've got some grit about ya, maybe you won't be as useless as the last lot.",
            `Here, take this blueprint for handgun ammo. Study it well, 'cause you're gonna need to make yourself ${Quests.Introduction.Constants.HANDGUN_AMMO_NEEDED} rounds if you plan on staying alive out here. Don't come back until you've got 'em all. The materials you'll need can be gathered in the mining site nearby.`
          ],
          options: [{ value: "accept", label: "Accept", color: "primary" }],
        }).then((option) => {
          if (option?.value === "accept") {
            alt.Events.emitServerRaw(
              ServerEvents.FromClient.REGISTER_QUEST_FACT,
              Quests.Introduction.Facts.STARTED_CRAFTING,
            );
          }
        });
      },
    });
  }

  if (
    questFacts.includes(Quests.Introduction.Facts.STARTED_CRAFTING) &&
    !questFacts.includes(Quests.Introduction.Facts.COMPLETED_CRAFTING)
  ) {
    const ammo = getInventoryItem<AmmoItem>(useCharacter().inventory, {
      key: Ammo.HANDGUN_AMMO,
      grade: ItemGrade.COMMON,
    });

    if (ammo && ammo.item.amount >= Quests.Introduction.Constants.HANDGUN_AMMO_NEEDED) {
      interactions.push({
        key: Quests.Introduction.Facts.COMPLETED_CRAFTING,
        icon: "quest",
        label: "Talk",
        onSelect() {
          startConversation(ped, {
            topic: "Introduction",
            pages: [
              "Well, look at that. You actually pulled it off. Here's a blueprint for a pistol as a reward. Make good use of it, and maybe you won't end up like the others.",
            ],
            options: [{ value: "complete", label: "Complete", color: "primary" }],
          }).then((option) => {
            if (option?.value === "complete") {
              alt.Events.emitServerRaw(
                ServerEvents.FromClient.REGISTER_QUEST_FACT,
                Quests.Introduction.Facts.COMPLETED_CRAFTING,
              );
            }
          });
        },
      });
    }
  }

  return interactions;
});

// MARK: Inventory watcher
whileInGame(() => {
  /**
   * Wait for player to open their inventory for quest to continue
   */
  const stopWatching = watch(() => clientState.ui.window, (window) => {
    if (window?.type === WindowType.PLAYER_INVENTORY) {
      const questFacts = useCharacter().questFacts;
      if (questFacts.includes(Quests.Introduction.Facts.GOT_INTRODUCTION)
        && !questFacts.includes(Quests.Introduction.Facts.OPEN_INVENTORY)
      ) {
        alt.Events.emitServerRaw(ServerEvents.FromClient.REGISTER_QUEST_FACT, Quests.Introduction.Facts.OPEN_INVENTORY);
        stopWatching();
      }
    }
  });

  return () => {
    stopWatching();
  };
});
