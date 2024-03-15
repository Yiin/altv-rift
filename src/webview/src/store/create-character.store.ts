import { defineStore } from "pinia";
import { watch } from "vue";
import {
  featureNames,
  aspects,
  blushColors,
  getRandomHair,
  headOverlays,
  OverlayType,
} from "@shared/modules/character/appearance-data";
import { ServerCall } from "@shared/calls/server";
import { rpc } from "../rpc";
import { pinia } from ".";
import type { Appearance } from "@prisma/client/edge";

const MALE = 0;
const FEMALE = 1;

function getDefaultAppearance(sex: 0 | 1) {
  const hair = getRandomHair(sex);
  const hairCollection = aspects(sex).Hair.options.get(hair)!.collection;
  const hairOverlay = aspects(sex).Hair.options.get(hair)!.overlay;

  return {
    faceFather: sex === MALE ? 0 : 45,
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
          color1: id === OverlayType.Blush ? [...blushColors.keys()][0] : color1?.min ?? null,
          color2: id === OverlayType.Blush ? [...blushColors.keys()][0] : color2?.min ?? null,
        }),
      new Map<OverlayType, Appearance["headOverlays"][number]>(),
    ),
    hair,
    hairCollection,
    hairOverlay,
    hairDlc: 0,
    hairColor1: 0,
    hairColor2: 0,
    eyes: 0,
  };
}

export const useCreateCharacter = defineStore("create-character", {
  state: () => ({
    errors: {} as Record<string, string>,
    name: "",
    sex: MALE as 0 | 1,
    otherAppearance: getDefaultAppearance(FEMALE),
    currentAppearance: getDefaultAppearance(MALE),
  }),
  getters: {
    appearance: (state) => {
      return {
        sex: state.sex,
        skinMother: state.currentAppearance.skinMother,
        skinFather: state.currentAppearance.skinFather,
        skinMix: state.currentAppearance.skinMix,
        faceMother: state.currentAppearance.faceMother,
        faceFather: state.currentAppearance.faceFather,
        faceMix: state.currentAppearance.faceMix,
        hairColor1: state.currentAppearance.hairColor1,
        hairColor2: state.currentAppearance.hairColor2,
        features: [...state.currentAppearance.features],
        hair: state.currentAppearance.hair,
        hairCollection: state.currentAppearance.hairCollection,
        hairDlc: state.currentAppearance.hairDlc,
        hairOverlay: state.currentAppearance.hairOverlay,
        headOverlays: [...state.currentAppearance.headOverlays.values()],
        eyes: state.currentAppearance.eyes,
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

watch(
  () => useCreateCharacter(pinia).sex,
  (current, previous) => {
    if (current !== previous) {
      const createCharacter = useCreateCharacter(pinia);
      [createCharacter.currentAppearance, createCharacter.otherAppearance] = [
        createCharacter.otherAppearance,
        createCharacter.currentAppearance,
      ];
    }
  },
);

watch(
  () => useCreateCharacter(pinia).currentAppearance.hair,
  (current) => {
    const createCharacter = useCreateCharacter(pinia);

    createCharacter.currentAppearance.hairCollection = aspects(
      createCharacter.sex,
    ).Hair.options.get(current)!.collection;
    createCharacter.currentAppearance.hairOverlay = aspects(createCharacter.sex).Hair.options.get(
      current,
    )!.overlay;
  },
);
