import { defineStore } from "pinia";
import { featureNames } from "../scenes/create-character/data/features";
import { blushColors } from "../scenes/create-character/data/hair-and-colors";
import { headOverlayNames } from "../scenes/create-character/data/head-overlays";
import {
  headOverlays,
  OverlayType,
} from "../scenes/create-character/data/overlays";
import { fathers, mothers } from "../scenes/create-character/data/parents";

export const useCreateCharacter = defineStore("create-character", {
  state: () => ({
    name: "",
    sex: 0 as 0 | 1,
    faceFather: fathers[0].id,
    faceMother: mothers[0].id,
    skinFather: 0,
    skinMother: 0,
    faceMix: 0,
    skinMix: 0,
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
    hairOverlay: {
      overlay: "",
      collection: "",
    },
    facialHair: 0,
    facialHairColor1: 0,
    facialHairOpacity: 0,
    eyebrows: 0,
    eyebrowsOpacity: 0,
    eyebrowsColor1: 0,
    chestHair: 0,
    chestHairOpacity: 0,
    chestHairColor1: 0,
    eyes: 0,
    opacityOverlays: headOverlayNames.map(() => ({
      value: 0,
      opacity: 0,
    })),
    colorOverlays: [] as {
      value: number;
      color1: number;
      color2: number;
      opacity: number;
    }[],
  }),
});
