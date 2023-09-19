import * as alt from "@altv/client";
import * as game from "@altv/natives";
import { Npc } from "@shared/modules/npc/list";
import { Quests } from "@shared/modules/quests";
import { ServerEventsFromClient } from "@shared/events/server/from-client";
import { NpcInteraction } from "@shared/modules/npc/interactions";
import { ConversationOption } from "@shared/interfaces/conversation";
import { IconName } from "@/core/rmlui/components/icon/icon";
import { useCharacter } from "@/core/store/character.store";
import { whileEntityIsStreamedIn } from "@/core/game-state-hooks/entity-is-streamed-in.state";
import { registerQuest } from "../../lib/register-quest";
import { registerNpcInteractions } from "../../lib/register-npc-interactions";
import { startConversation } from "../../conversation";
import CAL_INTRODUCTION from "./conversations/0_CAL_INTRODUCTION.yaml";
import CAL_MEDKIT_HELP from "./conversations/1_0_CAL_MEDKIT_HELP.yaml";
import CAL_FAREWELL from "./conversations/1_CAL_FAREWELL.yaml";
import DIEGO_ASSIGNMENTS from "./conversations/2_DIEGO_ASSIGNMENTS.yaml";
import DIEGO_MINING from "./conversations/3_DIEGO_MINING.yaml";
import DIEGO_FISHING from "./conversations/4_DIEGO_FISHING.yaml";
import DIEGO_WOODCUTTING from "./conversations/5_DIEGO_WOODCUTTING.yaml";
import DIEGO_CRAFTING from "./conversations/6_DIEGO_CRAFTING.yaml";
import DIEGO_COMPLETE from "./conversations/7_DIEGO_COMPLETE.yaml";
import MINING_TUTOR_INTRO from "./conversations/8_MINING_TUTOR_INTRO.yaml";
import FISHING_TUTOR_INTRO from "./conversations/9_FISHING_TUTOR_INTRO.yaml";
import WOODCUTTING_TUTOR_INTRO from "./conversations/10_WOODCUTTING_TUTOR_INTRO.yaml";
import CRAFTING_TUTOR_INTRO from "./conversations/11_CRAFTING_TUTOR_INTRO.yaml";

whileEntityIsStreamedIn(
  (entity): entity is alt.Ped => entity instanceof alt.Ped,
  (entity) => {
    return () => {};
  }
);

registerQuest(Quests.Introduction.Key, {
  name: "Introduction",
  summary: "An introduction to the game",
  tasks: [
    {
      completedFact: Quests.Introduction.Facts.GOT_INTRODUCTION,
      title: "Get introduction",
      summary: `I've just survived an emergency plane landing on Cayo Perico. I should probably talk with someone to figure out the current situation on the ground.`,
      track() {
        return;
      },
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
      completedFact: Quests.Introduction.Facts.STARTED_MINING,
      title: "Help with materials",
      summary: "I need to talk with Sen-Lee to help in the mines.",
    },
    {
      visibleFact: Quests.Introduction.Facts.STARTED_MINING,
      completedFact: Quests.Introduction.Facts.COMPLETED_MINING,
      title: "Mining",
      summary: "Mine 30 rocks of any kind and bring them back to Sen-Lee.",
    },
    {
      visibleFact: Quests.Introduction.Facts.PICKED_FISHING,
      completedFact: Quests.Introduction.Facts.STARTED_FISHING,
      title: "Do some fishing",
      summary: "I should go to Grace for fishing help.",
    },
    {
      visibleFact: Quests.Introduction.Facts.STARTED_FISHING,
      completedFact: Quests.Introduction.Facts.COMPLETED_FISHING,
      title: "Fishing",
      summary: "Catch 50 fishes of any kind and bring them back to Grace.",
    },
    {
      visibleFact: Quests.Introduction.Facts.PICKED_WOODCUTTING,
      completedFact: Quests.Introduction.Facts.STARTED_WOODCUTTING,
      title: "Forestry",
      summary: "Nathan will give me the introduction to woodcutting.",
    },
    {
      visibleFact: Quests.Introduction.Facts.STARTED_WOODCUTTING,
      completedFact: Quests.Introduction.Facts.COMPLETED_WOODCUTTING,
      title: "Woodcutting",
      summary: "Chop 30 palm trees and bring them back to Nathan.",
    },
    {
      visibleFact: Quests.Introduction.Facts.PICKED_CRAFTING,
      completedFact: Quests.Introduction.Facts.STARTED_CRAFTING,
      title: "Craftmanship",
      summary: "To help with crafting, I should go see Sara.",
    },
    {
      visibleFact: Quests.Introduction.Facts.STARTED_CRAFTING,
      completedFact: Quests.Introduction.Facts.COMPLETED_CRAFTING,
      title: "Crafting",
      summary: "Craft 30 bags and bring them back to Sara.",
    },
    {
      visibleFact: Quests.Introduction.Facts.COMPLETED_ALL,
      completedFact: Quests.Introduction.Facts.COMPLETED_ALL,
      title: "Determination",
      summary: "I don't play around.",
    },
  ],
});

registerNpcInteractions(Npc.CAL_BURNETT, (ped) => {
  const interactions: NpcInteraction<IconName>[] = [];

  const questFacts = useCharacter().questFacts ?? [];

  if (!questFacts.includes(Quests.Introduction.Facts.GOT_INTRODUCTION)) {
    // Gives introduction
    interactions.push({
      key: Quests.Introduction.Facts.GOT_INTRODUCTION,
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
              ServerEventsFromClient.NOTIFY,
              Quests.Introduction.Facts.GOT_INTRODUCTION
            );
          }
        });
      },
    });
  }

  if (
    questFacts.includes(Quests.Introduction.Facts.GOT_INTRODUCTION) &&
    !questFacts.includes(Quests.Introduction.Facts.USED_MEDKIT)
  ) {
    interactions.push({
      key: Quests.Introduction.Facts.USED_MEDKIT,
      icon: "dialog",
      label: "Talk",
      onSelect() {
        startConversation(ped, {
          pages: CAL_MEDKIT_HELP,
          topic: "Introduction",
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
      key: Quests.Introduction.Facts.GOT_DIRECTIONS,
      icon: "quest",
      label: "Talk",
      onSelect() {
        startConversation(ped, {
          pages: CAL_FAREWELL,
          topic: "Introduction",
          options: [{ value: "confirm", label: "Confirm", color: "primary" }, { label: "Cancel" }],
        }).then((option) => {
          if (option?.value === "confirm") {
            alt.Events.emitServer(
              ServerEventsFromClient.NOTIFY,
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
          alt.Events.emitServer(ServerEventsFromClient.NOTIFY, selectedOption.value);
        }
      });
    });
  }

  const needsIntro =
    questFacts.includes(Quests.Introduction.Facts.GOT_DIRECTIONS) &&
    !questFacts.includes(Quests.Introduction.Facts.DIEGO_INTRO);

  if (needsIntro) {
    interactions.push({
      key: Quests.Introduction.Facts.DIEGO_INTRO,
      icon: "quest",
      label: "Talk",
      onSelect() {
        startConversation(ped, {
          topic: "Introduction",
          pages: DIEGO_ASSIGNMENTS.slice(0, DIEGO_ASSIGNMENTS.length - 1),
        }).then(() => {
          alt.Events.emitServer(ServerEventsFromClient.NOTIFY, Quests.Introduction.Facts.DIEGO_INTRO);
          openTaskSelection();
        });
      },
    });
  } else {
    const hasIncompleteTasks = [
      Quests.Introduction.Facts.COMPLETED_MINING,
      Quests.Introduction.Facts.COMPLETED_FISHING,
      Quests.Introduction.Facts.COMPLETED_WOODCUTTING,
      Quests.Introduction.Facts.COMPLETED_CRAFTING,
    ].some((fact) => !questFacts.includes(fact));

    if (hasIncompleteTasks) {
      interactions.push({
        key: Quests.Introduction.Facts.COMPLETED_ALL,
        icon: "quest",
        label: "Talk",
        onSelect: openTaskSelection,
      });
    } else {
      const gotRecognition = questFacts.includes(Quests.Introduction.Facts.COMPLETED_ALL);

      if (!needsIntro && !hasIncompleteTasks && !gotRecognition) {
        interactions.push({
          key: Quests.Introduction.Facts.COMPLETED_ALL,
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
                ServerEventsFromClient.NOTIFY,
                Quests.Introduction.Facts.COMPLETED_ALL
              );
            });
          },
        });
      }
    }
  }

  return interactions;
});

registerNpcInteractions(Npc.FISHING_TUTOR, (ped) => {
  const interactions: NpcInteraction<IconName>[] = [];

  const questFacts = useCharacter().questFacts ?? [];

  if (
    questFacts.includes(Quests.Introduction.Facts.PICKED_FISHING) &&
    !questFacts.includes(Quests.Introduction.Facts.STARTED_FISHING)
  ) {
    interactions.push({
      key: Quests.Introduction.Facts.STARTED_FISHING,
      icon: "quest",
      label: "Talk",
      onSelect() {
        startConversation(ped, {
          topic: "Introduction",
          pages: FISHING_TUTOR_INTRO,
          options: [{ value: "accept", label: "Accept", color: "primary" }],
        }).then((option) => {
          if (option?.value === "accept") {
            alt.Events.emitServer(
              ServerEventsFromClient.NOTIFY,
              Quests.Introduction.Facts.STARTED_FISHING
            );
          }
        });
      },
    });
  }

  return interactions;
});

registerNpcInteractions(Npc.MINING_TUTOR, (ped) => {
  const interactions: NpcInteraction<IconName>[] = [];

  const questFacts = useCharacter().questFacts ?? [];

  if (
    questFacts.includes(Quests.Introduction.Facts.PICKED_MINING) &&
    !questFacts.includes(Quests.Introduction.Facts.STARTED_MINING)
  ) {
    interactions.push({
      key: Quests.Introduction.Facts.STARTED_MINING,
      icon: "quest",
      label: "Talk",
      onSelect() {
        startConversation(ped, {
          topic: "Introduction",
          pages: MINING_TUTOR_INTRO,
          options: [{ value: "accept", label: "Accept", color: "primary" }],
        }).then((option) => {
          if (option?.value === "accept") {
            alt.Events.emitServer(
              ServerEventsFromClient.NOTIFY,
              Quests.Introduction.Facts.STARTED_MINING
            );
          }
        });
      },
    });
  }

  return interactions;
});

registerNpcInteractions(Npc.WOODCUTTING_TUTOR, (ped) => {
  const interactions: NpcInteraction<IconName>[] = [];

  const questFacts = useCharacter().questFacts ?? [];

  if (
    questFacts.includes(Quests.Introduction.Facts.PICKED_WOODCUTTING) &&
    !questFacts.includes(Quests.Introduction.Facts.STARTED_WOODCUTTING)
  ) {
    interactions.push({
      key: Quests.Introduction.Facts.STARTED_WOODCUTTING,
      icon: "quest",
      label: "Talk",
      onSelect() {
        startConversation(ped, {
          topic: "Introduction",
          pages: WOODCUTTING_TUTOR_INTRO,
          options: [{ value: "accept", label: "Accept", color: "primary" }],
        }).then((option) => {
          if (option?.value === "accept") {
            alt.Events.emitServer(
              ServerEventsFromClient.NOTIFY,
              Quests.Introduction.Facts.STARTED_WOODCUTTING
            );
          }
        });
      },
    });
  }

  return interactions;
});

registerNpcInteractions(Npc.CRAFTING_TUTOR, (ped) => {
  const interactions: NpcInteraction<IconName>[] = [];

  const questFacts = useCharacter().questFacts ?? [];

  if (
    questFacts.includes(Quests.Introduction.Facts.PICKED_CRAFTING) &&
    !questFacts.includes(Quests.Introduction.Facts.STARTED_CRAFTING)
  ) {
    interactions.push({
      key: Quests.Introduction.Facts.STARTED_CRAFTING,
      icon: "quest",
      label: "Talk",
      onSelect() {
        startConversation(ped, {
          topic: "Introduction",
          pages: CRAFTING_TUTOR_INTRO,
          options: [{ value: "accept", label: "Accept", color: "primary" }],
        }).then((option) => {
          if (option?.value === "accept") {
            alt.Events.emitServer(
              ServerEventsFromClient.NOTIFY,
              Quests.Introduction.Facts.STARTED_CRAFTING
            );
          }
        });
      },
    });
  }

  return interactions;
});
