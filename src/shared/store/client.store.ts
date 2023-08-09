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

export interface QuestRegistration {
  name: string;
  summary: string;
  tasks: {
    visibleFact?: string;
    completedFact: string;
    title: string;
    summary: string;
  }[];
}

interface ClientState {
  conversation: CurrentConversation | null;
  quests: Map<string, QuestRegistration>;
}

export const getDefaultClientStoreState = (): ClientState => ({
  conversation: null,
  quests: new Map(),
});
