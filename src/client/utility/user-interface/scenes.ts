import { SCENE } from "@shared/enums/ui";

export const Scenes = {
  [SCENE.CREATE_CHARACTER]: {
    hasCursor: true,
  },
  [SCENE.IN_GAME]: {
    hasCursor: false,
  },
} as const;
