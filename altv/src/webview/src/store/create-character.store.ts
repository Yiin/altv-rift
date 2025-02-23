import { defineStore } from "pinia";
import { watch, watchEffect } from "vue";
import _ from "lodash";
import {
  featureNames,
  aspects,
  blushColors,
  getRandomHair,
  headOverlays,
  OverlayType,
  Gender,
} from "@shared/modules/character/appearance-data";
import { ServerCall } from "@shared/calls/server";
import { rpc } from "../rpc";
import { pinia } from ".";
import type { Appearance } from "@prisma/client/edge";

function getDefaultAppearance(sex: Gender) {
  const hair = getRandomHair(sex);
  const hairCollection = aspects(sex).Hair.options.get(hair)!.collection;
  const hairOverlay = aspects(sex).Hair.options.get(hair)!.overlay;

  return {
    faceFather: sex === Gender.MALE ? 0 : 45,
    faceMother: 21,
    skinFather: 0,
    skinMother: 21,
    faceMix: 0.5,
    skinMix: 0.5,
    features: featureNames.map(() => 0),
    headOverlays: _.merge(
      [...headOverlays.values()].reduce(
        (map, { id, opacity, color1, color2 }) => {
          return {
            ...map,
            [id]: {
              id,
              value: 255,
              opacity: opacity?.max ?? null,
              color1: id === OverlayType.Blush ? [...blushColors.keys()][0] : color1?.min ?? null,
              color2: id === OverlayType.Blush ? [...blushColors.keys()][0] : color2?.min ?? null,
            },
          };
        },
        {} as Record<OverlayType, Appearance["headOverlays"][number]>,
      ),
      sex === Gender.MALE
        ? {
            // Default eyebrows
            "2": { id: 2, value: 1, opacity: 1, color1: 0, color2: 0 },
          }
        : {
            // Default eyebrows
            "2": { id: 2, value: 2, opacity: 1, color1: 0, color2: 0 },
          },
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
    sex: Gender.MALE as Gender,
    otherAppearance: getDefaultAppearance(Gender.FEMALE),
    currentAppearance: getDefaultAppearance(Gender.MALE),
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
        headOverlays: Object.values(state.currentAppearance.headOverlays),
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
  (hair) => {
    const createCharacter = useCreateCharacter(pinia);

    const aspect = aspects(createCharacter.sex).Hair.options.get(hair);

    if (aspect) {
      createCharacter.currentAppearance.hairCollection = aspect.collection;
      createCharacter.currentAppearance.hairOverlay = aspect.overlay;
    }
  },
);

watch(
  () => [
    useCreateCharacter(pinia).currentAppearance.faceMix,
    useCreateCharacter(pinia).otherAppearance.faceMix,
    useCreateCharacter(pinia).sex,
  ],
  (current, previous) => {
    console.log(
      "faceMix",
      previous[0],
      "->",
      current[0],
      " | ",
      previous[1],
      "->",
      current[1],
      " | sex",
      previous[2],
      "->",
      current[2],
    );
  },
);
