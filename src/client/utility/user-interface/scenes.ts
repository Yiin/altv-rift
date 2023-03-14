import { SCENE } from "@shared/enums/ui";

export const Scenes = {
  [SCENE.DISCORD_AUTH]: {
    hasCursor: true,
  },
  [SCENE.CREATE_CHARACTER]: {
    hasCursor: true,
  },
  [SCENE.IN_GAME]: {
    hasCursor: false,
  },
} as const;
