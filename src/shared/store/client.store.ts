/**
 * Used to sync state of the client to the webview.
 *
 * @ref src/client/store/client.ts
 * @ref src/webview/src/store/client.ts
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

export enum ClientFlags {
  CanFish = "CanFish",
}

export enum ActionType {
  FISHING = "fishing",
  ENGINE = "engine",
  TRUNK = "trunk",
}

export type ActionItem = {
  type: ActionType;
  title: string;
  subtitle?: string;
};

export type TargetAction = {
  icon: string;
  iconProps?: Record<string, any>;
  screenPos?: { x: number; y: number };
  text: string;
};

interface ClientState {
  conversation: CurrentConversation | null;
  quests: Map<string, QuestRegistration>;
  flags: Set<ClientFlags>;
  actionMenu: ActionItem[];
  targetAction: TargetAction | null;
}

export const getDefaultClientStoreState = (): ClientState => ({
  conversation: null,
  quests: new Map(),
  flags: new Set(),
  actionMenu: [],
  targetAction: null,
});
