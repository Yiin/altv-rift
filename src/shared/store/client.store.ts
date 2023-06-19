/**
 * Used to sync state of the client to the webview.
 *
 * @ref src/client/store/client.store.ts
 * @ref src/webview/src/store/client.store.ts
 */

type PositionOnScreen = {
  x: number;
  y: number;
  scale: number;
  skewX: number;
  skewZ: number;
};

export type WorldUIElement = {
  id: string;
  pos: PositionOnScreen;
  type: string;
  meta: any;
};

export enum WorldUIElementType {
  NpcLabel = "npc-label",
}

interface State {
  worldUIElements: { [key: string]: WorldUIElement };
}

export const getDefaultClientStoreState = (): State => ({
  worldUIElements: {},
});
