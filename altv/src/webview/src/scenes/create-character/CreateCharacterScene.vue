<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import _ from "lodash";
import {
  getRandomHair,
  getRandomHairColor,
  getRandomHairHighlightColor,
  getRandomOverlayItemValue,
  getRandomOverlayItemOpacity,
  getRandomOverlayColor,
  getRandomFeatureValue,
  notRandomizableOverlaysForGender,
  headOverlays,
  getRandomParent,
  getRandomResemblance,
} from "@shared/modules/character/appearance-data";
import { ClientEvents } from "@shared/events/client";
import { useCreateCharacter } from "@/store/create-character.store";
import { useEventListener } from "@/composables/use-event-listener";
import Screen from "@/components/Screen.vue";
import NameAndSex from "./NameAndSex.vue";
import Features from "./Features.vue";
import Appearance from "./Appearance.vue";
import FaceShape from "./FaceShape.vue";
import FaceSkin from "./FaceSkin.vue";
import PlayButton from "./PlayButton.vue";

const createCharacter = useCreateCharacter();

const screenRef = ref<InstanceType<typeof Screen> | null>(null);

watch(createCharacter, () => {
  alt.emit(ClientEvents.FromWebview.UPDATE_CHARACTER_APPEARANCE, createCharacter.appearance);
});

onMounted(() => {
  alt.emit(ClientEvents.FromWebview.UPDATE_CHARACTER_APPEARANCE, createCharacter.appearance);
});

useEventListener("pointerdown", (e) => {
  if (
    e.target instanceof HTMLElement &&
    (e.target.classList.contains("v-main") || "screen" in e.target.dataset)
  ) {
    alt.emit(ClientEvents.FromWebview.CAMERA_MOVE_START);
  }
});

useEventListener("pointerup", () => {
  alt.emit(ClientEvents.FromWebview.CAMERA_MOVE_END);
});

function randomize() {
  createCharacter.currentAppearance.faceMother = getRandomParent(createCharacter.sex);
  createCharacter.currentAppearance.faceFather = getRandomParent(createCharacter.sex);
  createCharacter.currentAppearance.skinMother = getRandomParent(createCharacter.sex);
  createCharacter.currentAppearance.skinFather = getRandomParent();
  createCharacter.currentAppearance.faceMix = getRandomResemblance(createCharacter.sex);
  createCharacter.currentAppearance.skinMix = getRandomResemblance(createCharacter.sex);

  for (const idx in createCharacter.currentAppearance.features) {
    createCharacter.currentAppearance.features[idx] = getRandomFeatureValue();
  }

  createCharacter.currentAppearance.hair = getRandomHair(createCharacter.sex);
  createCharacter.currentAppearance.hairColor1 = getRandomHairColor();
  createCharacter.currentAppearance.hairColor2 = getRandomHairHighlightColor();

  for (const [key, overlay] of Object.entries(createCharacter.currentAppearance.headOverlays)) {
    if (notRandomizableOverlaysForGender(createCharacter.sex).includes(key)) {
      continue;
    }

    overlay.value = getRandomOverlayItemValue(+key);
    overlay.opacity = getRandomOverlayItemOpacity(+key);

    if (headOverlays.get(+key)?.color1) {
      overlay.color1 = getRandomOverlayColor(+key);
    }
    if (headOverlays.get(+key)?.color2) {
      overlay.color2 = getRandomOverlayColor(+key);
    }
  }
}

const FemalePresets = [
  {
    faceFather: 42,
    faceMother: 25,
    skinFather: 42,
    skinMother: 25,
    faceMix: 0.1493762276370972,
    skinMix: 0.5,
    features: [
      -0.20664649360301535, 0.8462600201730637, -0.38060200668896316, -0.04526198439241913,
      -0.07787864309603443, -0.010946541381324004, 0.32439348091522, -0.8154907894038329,
      -0.8280617932791846, 0.3695811434941869, -0.2739577882435025, -1, -0.7740798883656026,
      -0.26100759144237407, -0.6106174019217497, 0.3570101396188352, 0.4674311196050327,
      -0.1431119605032648, -0.5110686415034241, 0,
    ],
    headOverlays: {
      "0": { id: 0, value: 255, opacity: 1, color1: null, color2: null },
      "1": { id: 1, value: 255, opacity: 1, color1: 0, color2: 0 },
      "2": { id: 2, value: 5, opacity: 1, color1: 0, color2: 0 },
      "3": { id: 3, value: 255, opacity: 1, color1: null, color2: null },
      "4": { id: 4, value: 1, opacity: 1, color1: 0, color2: 0 },
      "5": { id: 5, value: 0, opacity: 0.72, color1: 8, color2: 9 },
      "6": { id: 6, value: 10, opacity: 0.2, color1: null, color2: null },
      "7": { id: 7, value: 255, opacity: 1, color1: null, color2: null },
      "8": { id: 8, value: 0, opacity: 0.43, color1: 61, color2: 0 },
      "9": { id: 9, value: 255, opacity: 1, color1: null, color2: null },
      "10": { id: 10, value: 255, opacity: 1, color1: 0, color2: null },
      "11": { id: 11, value: 255, opacity: 1, color1: null, color2: null },
    },
    hair: 5,
    eyes: 2,
  },
  {
    faceFather: 12,
    faceMother: 40,
    skinFather: 12,
    skinMother: 40,
    faceMix: 0,
    skinMix: 0.6250358337314859,
    features: [
      -0.8372352285395763, 0.24828794394011777, 0.8698518872431916, 0.20479906566863093,
      -0.12136752136752138, 0.010797897754419417, -0.13223974093539315, -0.02181876094919577,
      -0.5671285236502628, 0.16300897170462392, 0.16678876678876675, 0.14297342868771445, -1,
      -0.4349631045283219, -0.8715506715506716, 0.24828794394011777, 0.2608589478154695, -1,
      -0.6524074958857567, 0,
    ],
    headOverlays: {
      "0": { id: 0, value: 255, opacity: 1, color1: null, color2: null },
      "1": { id: 1, value: 255, opacity: 1, color1: 0, color2: 0 },
      "2": { id: 2, value: 0, opacity: 1, color1: 60, color2: 0 },
      "3": { id: 3, value: 255, opacity: 1, color1: null, color2: null },
      "4": { id: 4, value: 5, opacity: 1, color1: 0, color2: 0 },
      "5": { id: 5, value: 4, opacity: 0.51, color1: 10, color2: 9 },
      "6": { id: 6, value: 10, opacity: 0.29, color1: null, color2: null },
      "7": { id: 7, value: 255, opacity: 1, color1: null, color2: null },
      "8": { id: 8, value: 1, opacity: 0.59, color1: 5, color2: 0 },
      "9": { id: 9, value: 0, opacity: 1, color1: null, color2: null },
      "10": { id: 10, value: 255, opacity: 1, color1: 0, color2: null },
      "11": { id: 11, value: 255, opacity: 1, color1: null, color2: null },
    },
    hair: 10,
    eyes: 3,
  },
  {
    faceFather: 8,
    faceMother: 27,
    skinFather: 8,
    skinMother: 27,
    faceMix: 0,
    skinMix: 0,
    features: [
      -0.5110686415034241, 0.3026490417794765, -0.2827520305781175, 0.4004990178903223,
      -0.20834527791049529, -0.00007432181345223832, -0.24096193661411047, -0.04356320008493919,
      -0.45840632797154535, 0.14126453256888039, -1, 0.2858654572940287, -1, 0.03254233689016295,
      -0.6649784997611085, 0.46573233529755265, -0.3914742262568349, -0.8389340128470564,
      0.3152200456548282, -1,
    ],
    headOverlays: {
      "0": { id: 0, value: 255, opacity: 1, color1: null, color2: null },
      "1": { id: 1, value: 255, opacity: 1, color1: 0, color2: 0 },
      "2": { id: 2, value: 5, opacity: 1, color1: 0, color2: 0 },
      "3": { id: 3, value: 255, opacity: 1, color1: null, color2: null },
      "4": { id: 4, value: 37, opacity: 0.8, color1: 0, color2: 0 },
      "5": { id: 5, value: 255, opacity: 1, color1: 0, color2: 9 },
      "6": { id: 6, value: 10, opacity: 0.63, color1: null, color2: null },
      "7": { id: 7, value: 255, opacity: 1, color1: null, color2: null },
      "8": { id: 8, value: 0, opacity: 0.43, color1: 20, color2: 0 },
      "9": { id: 9, value: 255, opacity: 1, color1: null, color2: null },
      "10": { id: 10, value: 255, opacity: 1, color1: 0, color2: null },
      "11": { id: 11, value: 255, opacity: 1, color1: null, color2: null },
    },
    hair: 11,
    eyes: 3,
  },
  {
    faceFather: 21,
    faceMother: 37,
    skinFather: 12,
    skinMother: 25,
    faceMix: 0.5054414184848968,
    skinMix: 0.5135955831608006,
    features: [
      -0.8698518872431916, 0.21567128523650259, 0.47845198279980894, 0.5744545309762701,
      0.12869352869352868, 0.010797897754419417, -0.3823007909964432, 0.33696448479057173,
      -0.4801507671072889, 0.043414556458034825, -0.34524100238385946, 0.3215884644456073, -1, -1,
      -1, -0.5671285236502628, 0.16300897170462392, -0.6288156288156288, 0.4348144609014175, -1,
    ],
    headOverlays: {
      "0": { id: 0, value: 255, opacity: 1, color1: null, color2: null },
      "1": { id: 1, value: 255, opacity: 1, color1: 0, color2: 0 },
      "2": { id: 2, value: 5, opacity: 1, color1: 0, color2: 0 },
      "3": { id: 3, value: 255, opacity: 1, color1: null, color2: null },
      "4": { id: 4, value: 1, opacity: 1, color1: 0, color2: 0 },
      "5": { id: 5, value: 0, opacity: 0.72, color1: 8, color2: 9 },
      "6": { id: 6, value: 10, opacity: 0.2, color1: null, color2: null },
      "7": { id: 7, value: 255, opacity: 1, color1: null, color2: null },
      "8": { id: 8, value: 1, opacity: 0.4, color1: 17, color2: 0 },
      "9": { id: 9, value: 255, opacity: 1, color1: null, color2: null },
      "10": { id: 10, value: 255, opacity: 1, color1: 0, color2: null },
      "11": { id: 11, value: 255, opacity: 1, color1: null, color2: null },
    },
    hair: 76,
    eyes: 0,
  },
  {
    faceFather: 12,
    faceMother: 25,
    skinFather: 12,
    skinMother: 25,
    faceMix: 0,
    skinMix: 0.5299039125126082,
    features: [
      -0.8481074481074481, 0.31352126134734837, 0.4348144609014175, 0.5200934331369114,
      0.13956574826140034, -0.010946541381324004, -0.33881191272495625, 0.2608589478154695,
      -0.5236396453787758, -0.15213675213675193, -0.3215884644456073, 0.5597418454561311, -1, -1,
      -1, -0.556256304082391, 0.13039231300100873, -1, 0.3152200456548282, -1,
    ],
    headOverlays: {
      "0": { id: 0, value: 255, opacity: 1, color1: null, color2: null },
      "1": { id: 1, value: 255, opacity: 1, color1: 0, color2: 0 },
      "2": { id: 2, value: 5, opacity: 1, color1: 0, color2: 0 },
      "3": { id: 3, value: 255, opacity: 1, color1: null, color2: null },
      "4": { id: 4, value: 1, opacity: 1, color1: 0, color2: 0 },
      "5": { id: 5, value: 255, opacity: 1, color1: 0, color2: 0 },
      "6": { id: 6, value: 0, opacity: 0, color1: null, color2: null },
      "7": { id: 7, value: 255, opacity: 1, color1: null, color2: null },
      "8": { id: 8, value: 255, opacity: 1, color1: 0, color2: 0 },
      "9": { id: 9, value: 255, opacity: 1, color1: null, color2: null },
      "10": { id: 10, value: 255, opacity: 1, color1: 0, color2: null },
      "11": { id: 11, value: 255, opacity: 1, color1: null, color2: null },
    },
    hair: 14,
    eyes: 6,
  },
];

const MalePresets = [
  {
    faceFather: 17,
    faceMother: 21,
    skinFather: 17,
    skinMother: 21,
    faceMix: 0.41,
    skinMix: 0,
    features: [
      -0.47845198279980894, 0.019971333014811243, 1, -0.02351754525667571, 0.05258799171842643,
      0.010797897754419417, 0.21567128523650259, 0.24998672824759782, -0.06700642352816266,
      -0.032690980517067425, 0, 1, -1, -0.6306630567500133, -0.23008971704623882,
      0.43311567659393746, -0.4240908849604502, -0.6940489462228592, -1, 1,
    ],
    headOverlays: {
      "0": { id: 0, value: 255, opacity: 1, color1: null, color2: null },
      "1": { id: 1, value: 255, opacity: 1, color1: 0, color2: 0 },
      "2": { id: 2, value: 20, opacity: 1, color1: 0, color2: 0 },
      "3": { id: 3, value: 255, opacity: 1, color1: null, color2: null },
      "4": { id: 4, value: 32, opacity: 0.38, color1: 0, color2: 0 },
      "5": { id: 5, value: 255, opacity: 1, color1: 0, color2: 0 },
      "6": { id: 6, value: 11, opacity: 0.21, color1: null, color2: null },
      "7": { id: 7, value: 255, opacity: 1, color1: null, color2: null },
      "8": { id: 8, value: 1, opacity: 0.2, color1: 4, color2: 0 },
      "9": { id: 9, value: 255, opacity: 1, color1: null, color2: null },
      "10": { id: 10, value: 255, opacity: 1, color1: 0, color2: null },
      "11": { id: 11, value: 255, opacity: 1, color1: null, color2: null },
    },
    hair: 80,
    eyes: 5,
  },
  {
    faceFather: 2,
    faceMother: 38,
    skinFather: 2,
    skinMother: 38,
    faceMix: 0.66,
    skinMix: 0.64,
    features: [
      -0.6524074958857567, 0.20479906566863093, -0.02181876094919577, 0.05258799171842643,
      -0.11049530179964961, -0.02181876094919577, 0.12869352869352868, 0.21737006954398264,
      -0.24096193661411047, 0.20649784997611076, 0.47638816210244783, 1, -0.33333333333333326,
      -0.26100759144237407, -0.5018952062430324, -0.262706375749854, -0.20664649360301535,
      0.599745182353878, 0.20649784997611076, 1,
    ],
    headOverlays: {
      "0": { id: 0, value: 255, opacity: 1, color1: null, color2: null },
      "1": { id: 1, value: 7, opacity: 1, color1: 0, color2: 0 },
      "2": { id: 2, value: 33, opacity: 1, color1: 0, color2: 0 },
      "3": { id: 3, value: 255, opacity: 1, color1: null, color2: null },
      "4": { id: 4, value: 32, opacity: 0.38, color1: 0, color2: 0 },
      "5": { id: 5, value: 255, opacity: 1, color1: 0, color2: 0 },
      "6": { id: 6, value: 0, opacity: 1, color1: null, color2: null },
      "7": { id: 7, value: 255, opacity: 1, color1: null, color2: null },
      "8": { id: 8, value: 1, opacity: 0.2, color1: 4, color2: 0 },
      "9": { id: 9, value: 13, opacity: 1, color1: null, color2: null },
      "10": { id: 10, value: 0, opacity: 1, color1: 0, color2: null },
      "11": { id: 11, value: 255, opacity: 1, color1: null, color2: null },
    },
    hair: 81,
    eyes: 7,
  },
  {
    faceFather: 42,
    faceMother: 30,
    skinFather: 42,
    skinMother: 30,
    faceMix: 0.3940011679142114,
    skinMix: 0.8288899506290811,
    features: [
      -0.010946541381324004, 0.07433243085416996, 0.2175187131708871, 0.1830546265328874,
      -0.21921749747836705, -0.00007432181345223832, -0.1431119605032648, -0.1631576153315284,
      -0.6649784997611085, 0.1956256304082391, 0, 0.7383568812140241, -1, -0.641535276317885,
      -0.6323618410574932, -0.6649784997611085, -0.00007432181345223832, -0.06346021128629831,
      -0.00007432181345223832, -0.011989069131926322,
    ],
    headOverlays: {
      "0": { id: 0, value: 255, opacity: 1, color1: null, color2: null },
      "1": { id: 1, value: 5, opacity: 1, color1: 0, color2: 0 },
      "2": { id: 2, value: 30, opacity: 1, color1: 0, color2: 0 },
      "3": { id: 3, value: 255, opacity: 1, color1: null, color2: null },
      "4": { id: 4, value: 1, opacity: 0.51, color1: 0, color2: 0 },
      "5": { id: 5, value: 255, opacity: 1, color1: 0, color2: 0 },
      "6": { id: 6, value: 10, opacity: 0.13, color1: null, color2: null },
      "7": { id: 7, value: 255, opacity: 1, color1: null, color2: null },
      "8": { id: 8, value: 0, opacity: 0.16, color1: 8, color2: 0 },
      "9": { id: 9, value: 16, opacity: 1, color1: null, color2: null },
      "10": { id: 10, value: 0, opacity: 1, color1: 0, color2: null },
      "11": { id: 11, value: 255, opacity: 1, color1: null, color2: null },
    },
    hair: 0,
    eyes: 1,
  },
  {
    faceFather: 2,
    faceMother: 45,
    skinFather: 2,
    skinMother: 45,
    faceMix: 0.2744067526676222,
    skinMix: 0.3532303445346924,
    features: [
      -0.6524074958857567, 0.21567128523650259, -0.021670117322291294, 0.11782130912565703,
      0.1830546265328874, -0.00007432181345223832, 0.009099113446939588, -0.2175187131708871,
      0.019971333014811243, 0.48917555874077623, -0.7739170882028026, 1, 0.6192801907087622,
      -0.2501353718745023, -0.21921749747836705, -0.262706375749854, -0.26100759144237407,
      0.0017731061209321775, -0.3153686892817328, 0,
    ],
    headOverlays: {
      "0": { id: 0, value: 255, opacity: 1, color1: null, color2: null },
      "1": { id: 1, value: 255, opacity: 1, color1: 0, color2: 0 },
      "2": { id: 2, value: 19, opacity: 1, color1: 55, color2: 0 },
      "3": { id: 3, value: 255, opacity: 1, color1: null, color2: null },
      "4": { id: 4, value: 1, opacity: 0.31, color1: 0, color2: 0 },
      "5": { id: 5, value: 255, opacity: 1, color1: 0, color2: 0 },
      "6": { id: 6, value: 10, opacity: 0.14, color1: null, color2: null },
      "7": { id: 7, value: 255, opacity: 1, color1: null, color2: null },
      "8": { id: 8, value: 0, opacity: 0.14, color1: 7, color2: 0 },
      "9": { id: 9, value: 16, opacity: 0.81, color1: null, color2: null },
      "10": { id: 10, value: 255, opacity: 1, color1: 0, color2: null },
      "11": { id: 11, value: 255, opacity: 1, color1: null, color2: null },
    },
    hair: 79,
    hairCollection: "mp2023_01_overlays",
    hairOverlay: "MP_2023_01_Hair_000_M",
    hairDlc: 0,
    hairColor1: 55,
    hairColor2: 0,
    eyes: 3,
  },
  {
    faceFather: 44,
    faceMother: 31,
    skinFather: 44,
    skinMother: 31,
    faceMix: 0.28,
    skinMix: 0.62,
    features: [
      -0.00007432181345223832, 0.3026490417794765, 0.6413866326909805, 0.43311567659393746,
      -0.23008971704623882, -0.00007432181345223832, -0.6649784997611085, 0.23911450867972617,
      -0.49102298667516053, 0.44568668046928916, 0.2977731263445549, 1, -1, 0.2282422891118543,
      -0.262706375749854, 0.5853267505441417, -0.23926315230663053, 0.8606784519827998,
      0.08690343472952167, 0.035641607070178605,
    ],
    headOverlays: {
      "1": { id: 1, value: 7, opacity: 1, color1: 61, color2: 0 },
      "2": { id: 2, value: 28, opacity: 1, color1: 0, color2: 0 },
      "3": { id: 3, value: 255, opacity: 1, color1: null, color2: null },
      "4": { id: 4, value: 1, opacity: 0.42, color1: 0, color2: 0 },
      "5": { id: 5, value: 255, opacity: 1, color1: 0, color2: 0 },
      "6": { id: 6, value: 10, opacity: 0.17, color1: null, color2: null },
      "7": { id: 7, value: 255, opacity: 1, color1: null, color2: null },
      "8": { id: 8, value: 0, opacity: 0.35, color1: 8, color2: 0 },
      "9": { id: 9, value: 11, opacity: 1, color1: null, color2: null },
      "10": { id: 10, value: 255, opacity: 1, color1: 0, color2: null },
      "11": { id: 11, value: 255, opacity: 1, color1: null, color2: null },
    },
    hair: 21,
    eyes: 5,
  },
];
</script>

<template>
  <Screen ref="screenRef">
    <NameAndSex
      class="absolute left-1/2 top-screen-1/10 flex -translate-x-1/2 flex-col items-center justify-center gap-6"
    />
    <div class="absolute left-screen-1/10 top-screen-1/10 flex w-96 flex-col gap-8">
      <FaceShape />
      <Features />
    </div>
    <div class="absolute right-screen-1/10 top-screen-1/10 flex w-96 flex-col gap-8">
      <FaceSkin />
      <Appearance />
      <div>
        <div class="mb-1 uppercase text-white">Presets</div>
        <div class="flex gap-2">
          <div
            v-for="(preset, i) in createCharacter.sex ? MalePresets : FemalePresets"
            :key="i"
            @click="
              () => {
                _.merge(createCharacter.currentAppearance, preset);
              }
            "
            class="cursor-pointer items-center justify-center bg-black/50 p-5 text-lg font-bold leading-[0] text-white"
          >
            {{ i + 1 }}
          </div>
          <!-- <div
          @click="() => console.log(JSON.stringify(createCharacter.currentAppearance))"
          class="bg-white p-5 text-2xl leading-[0]"
        >
          SAVE
        </div> -->
        </div>
      </div>
    </div>
    <div class="absolute bottom-screen-1/10 left-1/2 -translate-x-1/2">
      <PlayButton />
    </div>
  </Screen>
</template>
