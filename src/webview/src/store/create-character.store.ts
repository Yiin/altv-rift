import { defineStore } from "pinia";
import rpc from "altv-rpc";
import { RPC } from "../../../shared/constants/rpcs";
import { featureNames } from "../scenes/create-character/data/features";
import { blushColors } from "../scenes/create-character/data/aspects";
import {
  headOverlays,
  OverlayType,
} from "../scenes/create-character/data/overlays";
import { Events } from "../../../shared/constants/events";

export const useCreateCharacter = defineStore("create-character", {
  state: () => ({
    name: "",
    sex: 0 as 0 | 1,
    faceFather: 0,
    faceMother: 21,
    skinFather: 0.5,
    skinMother: 0.5,
    faceMix: 0.5,
    skinMix: 0.5,
    features: featureNames.map(() => 0),
    headOverlays: [...headOverlays.values()].reduce(
      (map, { id, min, opacity, color1, color2 }) =>
        map.set(id, {
          value: min,
          ...(opacity && { opacity: opacity.min }),
          ...(color1 && {
            color1:
              id === OverlayType.Blush
                ? [...blushColors.keys()][0]
                : color1.min,
          }),
          ...(color2 && {
            color2:
              id === OverlayType.Blush
                ? [...blushColors.keys()][0]
                : color2.min,
          }),
        }),
      new Map<
        OverlayType,
        { value: number; opacity?: number; color1?: number; color2?: number }
      >()
    ),
    hair: 0,
    hairDlc: 0,
    hairColor1: 0,
    hairColor2: 0,
    eyes: 0,
  }),
  actions: {
    submit() {
      if ("alt" in window) {
        alt.emit(Events.Client.SCREENSHOT_CREATE);
      }
    },
  },
});
