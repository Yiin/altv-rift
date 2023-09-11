import alt from "@altv/client";
import { Npc } from "@shared/modules/npc/list";
import { Quests } from "@shared/modules/quests";
import { ServerEvents } from "@shared/events/server";
import { NpcInteraction } from "@shared/modules/npc/interactions";
import { ConversationOption } from "@shared/interfaces/conversation";
import { IconName } from "@/core/rmlui/components/icon/icon";
import { useCharacter } from "@/core/store/character.store";
import { registerQuest } from "../../register-quest";
import { registerNpcInteractions } from "../../register-npc-interactions";
import { startConversation } from "../../dialogue";
import CAL_INTRODUCTION from "./conversations/0_CAL_INTRODUCTION.yaml";
import CAL_FAREWELL from "./conversations/1_CAL_FAREWELL.yaml";
import DIEGO_ASSIGNMENTS from "./conversations/2_DIEGO_ASSIGNMENTS.yaml";
import DIEGO_MINING from "./conversations/3_DIEGO_MINING.yaml";
import DIEGO_FISHING from "./conversations/4_DIEGO_FISHING.yaml";
import DIEGO_WOODCUTTING from "./conversations/5_DIEGO_WOODCUTTING.yaml";
import DIEGO_CRAFTING from "./conversations/6_DIEGO_CRAFTING.yaml";
import DIEGO_COMPLETE from "./conversations/7_DIEGO_COMPLETE.yaml";

registerQuest(Quests.Introduction.Key, {
  name: "Introduction",
  summary: "An introduction to the game",
  tasks: [
    {
      completedFact: Quests.Introduction.Facts.GOT_INTRODUCTION,
      title: "Get introduction",
      summary: `I've just survived an emergency plane landing on Cayo Perico. I should probably talk with someone to figure out the current situation on the ground.`,
    },
    {
      visibleFact: Quests.Introduction.Facts.GOT_INTRODUCTION,
      completedFact: Quests.Introduction.Facts.USED_MEDKIT,
      title: "Patch yourself",
      summary: `I've received a med kit. I should use the supplies in the kit to patch up my wounds and counteract the dizziness I'm feeling.`,
    },
    {
      visibleFact: Quests.Introduction.Facts.USED_MEDKIT,
      completedFact: Quests.Introduction.Facts.GOT_DIRECTIONS,
      title: "Get directions",
      summary: `It would be a good idea to get some directions from Cal to figure out where I should go next.`,
    },
    {
      visibleFact: Quests.Introduction.Facts.GOT_DIRECTIONS,
      completedFact: Quests.Introduction.Facts.DIEGO_INTRO,
      title: "Diego Moreira",
      summary: `Cal suggested me to find and talk to Diego Moreira, a cop in charge.`,
    },
    {
      visibleFact: Quests.Introduction.Facts.PICKED_MINING,
      completedFact: Quests.Introduction.Facts.COMPLETED_MINING,
      title: "Help with materials",
      summary: "I need to talk with Sen-Lee to help in the mines.",
    },
    {
      visibleFact: Quests.Introduction.Facts.PICKED_FISHING,
      completedFact: Quests.Introduction.Facts.COMPLETED_FISHING,
      title: "Do some fishing",
      summary: "I should go to Grace for fishing help.",
    },
    {
      visibleFact: Quests.Introduction.Facts.PICKED_WOODCUTTING,
      completedFact: Quests.Introduction.Facts.COMPLETED_WOODCUTTING,
      title: "Forestry",
      summary: "Nathan will give me the introduction to woodcutting.",
    },
    {
      visibleFact: Quests.Introduction.Facts.PICKED_CRAFTING,
      completedFact: Quests.Introduction.Facts.COMPLETED_CRAFTING,
      title: "Craftmanship",
      summary: "To help with crafting, I should go see Sara.",
    },
    {
      visibleFact: Quests.Introduction.Facts.COMPLETED_ALL,
      completedFact: Quests.Introduction.Facts.COMPLETED_ALL,
      title: "Determination",
      summary: "I don't fuck around.",
    },
  ],
});

registerNpcInteractions(Npc.CAL_BURNETT, (ped: alt.Ped) => {
  const interactions: NpcInteraction<IconName>[] = [];

  const questFacts = useCharacter().questFacts ?? [];

  if (!questFacts.includes(Quests.Introduction.Facts.GOT_INTRODUCTION)) {
    // Gives introduction
    interactions.push({
      icon: "quest",
      label: "Talk",
      onSelect() {
        startConversation(ped, {
          pages: CAL_INTRODUCTION,
          topic: "Introduction",
          options: [
            { value: "accept", label: "Accept medicine", color: "primary" },
            { label: "Cancel" },
          ],
        }).then((option) => {
          if (option?.value === "accept") {
            alt.Events.emitServer(
              ServerEvents.FromClient.NOTIFY,
              Quests.Introduction.Facts.GOT_INTRODUCTION
            );
          }
        });
      },
    });
  }

  if (
    questFacts.includes(Quests.Introduction.Facts.USED_MEDKIT) &&
    !questFacts.includes(Quests.Introduction.Facts.GOT_DIRECTIONS)
  ) {
    // Gives directions to find Diego Moreira
    interactions.push({
      icon: "quest",
      label: "Talk",
      onSelect() {
        startConversation(ped, {
          pages: CAL_FAREWELL,
          topic: "Introduction",
          options: [{ value: "confirm", label: "Confirm", color: "primary" }, { label: "Cancel" }],
        }).then((option) => {
          console.log(option);
          if (option?.value === "confirm") {
            alt.Events.emitServer(
              ServerEvents.FromClient.NOTIFY,
              Quests.Introduction.Facts.GOT_DIRECTIONS
            );
          }
        });
      },
    });
  }

  return interactions;
});

registerNpcInteractions(Npc.DIEGO_MOREIRA, (ped) => {
  const interactions: NpcInteraction<IconName>[] = [];

  const questFacts = useCharacter().questFacts ?? [];

  function openTaskSelection() {
    startConversation(ped, {
      pages: (DIEGO_ASSIGNMENTS as string[]).slice(-1),
      topic: "Introduction",
      options: [
        !questFacts.includes(Quests.Introduction.Facts.PICKED_MINING) && {
          value: Quests.Introduction.Facts.PICKED_MINING,
          label: "Mining",
          color: "gray",
        },
        !questFacts.includes(Quests.Introduction.Facts.PICKED_FISHING) && {
          value: Quests.Introduction.Facts.PICKED_FISHING,
          label: "Fishing",
          color: "blue",
        },
        !questFacts.includes(Quests.Introduction.Facts.PICKED_WOODCUTTING) && {
          value: Quests.Introduction.Facts.PICKED_WOODCUTTING,
          label: "Woodcutting",
          color: "red",
        },
        !questFacts.includes(Quests.Introduction.Facts.PICKED_CRAFTING) && {
          value: Quests.Introduction.Facts.PICKED_CRAFTING,
          label: "Crafting",
          color: "yellow",
        },
      ].filter(Boolean) as ConversationOption[],
    }).then((option) => {
      if (!option || !option.value) {
        return;
      }

      const selectedOption = option;

      startConversation(ped, {
        topic: `Introduction`,
        pages: (
          {
            [Quests.Introduction.Facts.PICKED_MINING]: DIEGO_MINING,
            [Quests.Introduction.Facts.PICKED_FISHING]: DIEGO_FISHING,
            [Quests.Introduction.Facts.PICKED_WOODCUTTING]: DIEGO_WOODCUTTING,
            [Quests.Introduction.Facts.PICKED_CRAFTING]: DIEGO_CRAFTING,
          } as Record<string, string[]>
        )[option.value],
        options: [{ value: "complete", label: "Complete", color: "primary" }],
      }).then((option) => {
        if (option?.value === "complete") {
          alt.Events.emitServer(ServerEvents.FromClient.NOTIFY, selectedOption.value);
        }
      });
    });
  }

  const needsIntro =
    questFacts.includes(Quests.Introduction.Facts.GOT_DIRECTIONS) &&
    !questFacts.includes(Quests.Introduction.Facts.DIEGO_INTRO);

  if (needsIntro) {
    interactions.push({
      icon: "quest",
      label: "Talk",
      onSelect() {
        startConversation(ped, {
          topic: "Introduction",
          pages: DIEGO_ASSIGNMENTS.slice(0, DIEGO_ASSIGNMENTS.length - 1),
        }).then(openTaskSelection);
      },
    });
  }

  const hasIncompleteTasks = [
    Quests.Introduction.Facts.COMPLETED_MINING,
    Quests.Introduction.Facts.COMPLETED_FISHING,
    Quests.Introduction.Facts.COMPLETED_WOODCUTTING,
    Quests.Introduction.Facts.COMPLETED_CRAFTING,
  ].every((fact) => questFacts.includes(fact));

  if (hasIncompleteTasks) {
    interactions.push({
      icon: "quest",
      label: "Talk",
      onSelect: openTaskSelection,
    });
  }

  const gotRecognition = questFacts.includes(Quests.Introduction.Facts.COMPLETED_ALL);

  if (!hasIncompleteTasks && !gotRecognition) {
    interactions.push({
      icon: "quest",
      label: "Talk",
      onSelect() {
        startConversation(ped, {
          topic: "Introduction",
          pages: DIEGO_COMPLETE,
          options: [
            { value: "complete", label: "Complete", color: "primary" },
            { label: "Cancel" },
          ],
        }).then(() => {
          alt.Events.emitServer(
            ServerEvents.FromClient.NOTIFY,
            Quests.Introduction.Facts.COMPLETED_ALL
          );
        });
      },
    });
  }

  return interactions;
});
