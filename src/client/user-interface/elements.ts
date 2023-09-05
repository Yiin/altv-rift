import { ELEMENT } from "@/constants/ui";

export const Elements: Record<ELEMENT, { hasCursor: boolean }> = {
  [ELEMENT.INVENTORY]: {
    hasCursor: true,
  },
  [ELEMENT.CHAT]: {
    hasCursor: false,
  },
  [ELEMENT.ACTION_MENU]: {
    hasCursor: true,
  },
  [ELEMENT.QUEST_MENU]: {
    hasCursor: true,
  },
  [ELEMENT.SKILL_MENU]: {
    hasCursor: true,
  },
  [ELEMENT.TARGET_ACTION]: {
    hasCursor: false,
  },
};
