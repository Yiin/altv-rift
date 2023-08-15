/**
 * Used to sync state of the client to the webview.
 *
 * @ref src/client/store/client.store.ts
 * @ref src/webview/src/store/client.store.ts
 */

import { ConversationOption } from "@shared/interfaces/conversation";

export type CurrentConversation = {
  with: string;
  pages: string[];
  topic?: string;
  currentPage: number;
  finalOptions?: ConversationOption[];
  options: ConversationOption[];
  selectedOption: number;
};

export interface QuestTask {
  visibleFact?: string;
  completedFact: string;
  title: string;
  summary: string;
}

export interface QuestRegistration {
  name: string;
  summary: string;
  tasks: QuestTask[];
}

interface ClientState {
  conversation: CurrentConversation | null;
  quests: Map<string, QuestRegistration>;
}

export const getDefaultClientStoreState = (): ClientState => ({
  conversation: null,
  quests: new Map([["quest", {
    name: "Introduction",
    summary: "An introduction to the game",
    tasks: [
      {
        completedFact: "Quests.Introduction.Facts.GOT_INTRODUCTION",
        title: "Get introduction",
        summary: `I've just survived an emergency plane landing on Cayo Perico. I should probably talk with someone to figure out the current situation on the ground.`
      },
      {
        visibleFact: "Quests.Introduction.Facts.GOT_INTRODUCTION",
        completedFact: "Quests.Introduction.Facts.USED_MEDKIT",
        title: "Patch yourself",
        summary: `I've received a med kit. I should use the supplies in the kit to patch up my wounds and counteract the dizziness I'm feeling.`
      },
      {
        visibleFact: "Quests.Introduction.Facts.USED_MEDKIT",
        completedFact: "Quests.Introduction.Facts.GOT_DIRECTIONS",
        title: "Get directions",
        summary: `It would be a good idea to get some directions from Cal to figure out where I should go next.`
      },
      {
        visibleFact: "Quests.Introduction.Facts.GOT_DIRECTIONS",
        completedFact: "Quests.Introduction.Facts.DIEGO_INTRO",
        title: "Diego Moreira",
        summary: `Cal suggested me to find and talk to Diego Moreira, a cop in charge.`
      },
      {
        visibleFact: "Quests.Introduction.Facts.PICKED_MINING",
        completedFact: "Quests.Introduction.Facts.COMPLETED_MINING",
        title: "Help with materials",
        summary: "I need to talk with Sen-Lee to help in the mines."
      },
      {
        visibleFact: "Quests.Introduction.Facts.PICKED_FISHING",
        completedFact: "Quests.Introduction.Facts.COMPLETED_FISHING",
        title: "Do some fishing",
        summary: "I should go to Grace for fishing help."
      },
      {
        visibleFact: "Quests.Introduction.Facts.PICKED_WOODCUTTING",
        completedFact: "Quests.Introduction.Facts.COMPLETED_WOODCUTTING",
        title: "Forestry",
        summary: "Nathan will give me the introduction to woodcutting."
      },
      {
        visibleFact: "Quests.Introduction.Facts.PICKED_CRAFTING",
        completedFact: "Quests.Introduction.Facts.COMPLETED_CRAFTING",
        title: "Craftmanship",
        summary: "To help with crafting, I should go see Sara."
      },
      {
        visibleFact: "Quests.Introduction.Facts.COMPLETED_ALL",
        completedFact: "Quests.Introduction.Facts.COMPLETED_ALL",
        title: "Determination",
        summary: "I don't fuck around."
      }
    ]
  }]]),
});
