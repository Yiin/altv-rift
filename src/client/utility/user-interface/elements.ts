import { ELEMENT } from "@shared/enums/ui";

export const Elements = {
  [ELEMENT.INVENTORY]: {
    hasCursor: true,
  },
  [ELEMENT.CHAT]: {
    hasCursor: true,
  },
  [ELEMENT.JSON]: {
    hasCursor: true,
  },
} as const;
