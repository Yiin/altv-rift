/**
 * Used to sync state of the client to the webview.
 *
 * @ref src/client/store/client.ts
 * @ref src/webview/src/store/client.ts
 */

import { Scene, UIElement } from "@shared/enums/ui";
import { GlobalItemSource } from "@shared/interfaces";
import { ConversationOption } from "@shared/interfaces/conversation";
import { Item } from "@shared/modules/items";

export type CurrentConversation = {
  with: string;
  pages: string[];
  topic?: string;
  currentPage: number;
  finalOptions?: ConversationOption[];
  options: ConversationOption[];
  selectedOption: number;
};

export interface QuestTaskInfo {
  visibleFact?: string;
  completedFact: string;
  title: string;
  summary: string;
}

export interface QuestInfo {
  name: string;
  summary: string;
  tasks: QuestTaskInfo[];
}

export enum ClientFlags {
  CanFish = "CanFish",
  CanDig = "CanDig",
}

export enum ActionType {
  FISHING = "fishing",
  DIGGING = "digging",
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

export enum WindowType {
  PLAYER_INVENTORY,
  SHOP,
}

export type CurrentWindow = {
  type: WindowType;
};

export interface ClientState {
  ui: {
    scene: Scene | null;
    elements: Set<UIElement>;
    window: CurrentWindow | null;
  };
  conversation: CurrentConversation | null;
  trackingQuest: string | null;
  quests: Map<string, QuestInfo>;
  flags: Set<ClientFlags>;
  actionMenu: ActionItem[];
  targetAction: TargetAction | null;
  nearbyItems: {
    item: Item;
    source: GlobalItemSource;
  }[];
}

export const getDefaultClientStoreState = (): ClientState => ({
  ui: {
    scene: null,
    elements: new Set(),
    window: {
      type: WindowType.PLAYER_INVENTORY,
    },
  },
  conversation: null,
  trackingQuest: null,
  quests: new Map(),
  flags: new Set(),
  actionMenu: [],
  targetAction: null,
  nearbyItems: [],
});
