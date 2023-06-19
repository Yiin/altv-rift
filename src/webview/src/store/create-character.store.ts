import { defineStore } from "pinia";
import { rpc } from "../rpc";
import { featureNames } from "../scenes/create-character/data/features";
import { blushColors } from "../scenes/create-character/data/aspects";
import {
  headOverlays,
  OverlayType,
} from "../scenes/create-character/data/overlays";
import { ServerCall } from "@shared/calls/server";
import { Appearance } from ".prisma/client";

export const useCreateCharacter = defineStore("create-character", {
  state: () => ({
    errors: {} as Record<string, string>,
    name: "",
    sex: 0 as 0 | 1,
    faceFather: 0,
    faceMother: 21,
    skinFather: 0,
    skinMother: 21,
    faceMix: 0.5,
    skinMix: 0.5,
    features: featureNames.map(() => 0),
    headOverlays: [...headOverlays.values()].reduce(
      (map, { id, min, opacity, color1, color2 }) =>
        map.set(id, {
          id,
          value: min,
          opacity: opacity?.min ?? null,
          color1:
            id === OverlayType.Blush
              ? [...blushColors.keys()][0]
              : color1?.min ?? null,
          color2:
            id === OverlayType.Blush
              ? [...blushColors.keys()][0]
              : color2?.min ?? null,
        }),
      new Map<OverlayType, Appearance["headOverlays"][number]>()
    ),
    hair: 0,
    hairCollection: "mpbeach_overlays",
    hairOverlay: "FM_Hair_Fuzz",
    hairDlc: 0,
    hairColor1: 0,
    hairColor2: 0,
    eyes: 0,
  }),
  getters: {
    appearance: (state) => {
      return {
        sex: state.sex,
        skinMother: state.skinMother,
        skinFather: state.skinFather,
        skinMix: state.skinMix,
        faceMother: state.faceMother,
        faceFather: state.faceFather,
        faceMix: state.faceMix,
        hairColor1: state.hairColor1,
        hairColor2: state.hairColor2,
        features: [...state.features],
        hair: state.hair,
        hairCollection: state.hairCollection,
        hairDlc: state.hairDlc,
        hairOverlay: state.hairOverlay,
        headOverlays: [...state.headOverlays.values()],
        eyes: state.eyes,
      };
    },
  },
  actions: {
    submit() {
      return rpc.callServer(ServerCall.FromWebview.CREATE_CHARACTER, {
        name: this.name,
        appearance: this.appearance,
      });
    },
  },
});
