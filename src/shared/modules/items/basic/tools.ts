export const Tools = {
  FISHING_ROD: "fishingrod",
} as const;

export type ToolItemKey = (typeof Tools)[keyof typeof Tools];

export type ToolItemInfo = {
  key: ToolItemKey;
  name: string;
  description: string;
};

export const tools: Record<ToolItemKey, ToolItemInfo> = {
  fishingrod: {
    key: "fishingrod",
    name: "Fishing rod",
    description: "A simple rod and reel for catching fish. Ideal for beginners.",
  },
};

export function isItemKeyTool(key: string): key is ToolItemKey {
  return key in tools;
}
