import { ELEMENT } from "@/constants/ui";

export const Elements = {
  [ELEMENT.INVENTORY]: {
    hasCursor: true,
  },
  [ELEMENT.CHAT]: {
    hasCursor: false,
  },
  [ELEMENT.JSON]: {
    hasCursor: true,
  },
} as const;
