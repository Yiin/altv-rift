<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useCreateCharacter } from "@/store/create-character.store";
import {
  getRandomHair,
  aspects,
  getRandomHairColor,
  getRandomHairHighlightColor,
  getRandomOverlayItemValue,
  getRandomOverlayItemOpacity,
  getRandomOverlayColor,
} from "./data/aspects";
import { getRandomFeatureValue } from "./data/features";
import { notRandomizableOverlaysForGender } from "./data/head-overlays";
import { headOverlays } from "./data/overlays";
import { getRandomParent, getRandomResemblance } from "./data/parents";
import NameAndSex from "./NameAndSex.vue";
import Features from "./Features.vue";
import Appearance from "./Appearance.vue";
import FaceShape from "./FaceShape.vue";
import FaceSkin from "./FaceSkin.vue";
import { useEventListener } from "@/composables/use-event-listener";
import PlayButton from "./PlayButton.vue";
import Screen from "@/components/Screen.vue";
import { ClientEvents } from "@shared/events/client";

const createCharacter = useCreateCharacter();

const screenRef = ref<InstanceType<typeof Screen> | null>(null);

watch(createCharacter, () => {
  alt.Events.emit(ClientEvents.FromWebview.UPDATE_CHARACTER_APPEARANCE, createCharacter.appearance);
});

onMounted(() => {
  alt.Events.emit(ClientEvents.FromWebview.UPDATE_CHARACTER_APPEARANCE, createCharacter.appearance);
});

useEventListener("pointerdown", (e) => {
  if (
    e.target instanceof HTMLElement &&
    (e.target.classList.contains("v-main") || "screen" in e.target.dataset)
  ) {
    alt.Events.emit(ClientEvents.FromWebview.CAMERA_MOVE_START);
  }
});

useEventListener("pointerup", (e) => {
  alt.Events.emit(ClientEvents.FromWebview.CAMERA_MOVE_END);
});

function randomize() {
  createCharacter.faceMother = getRandomParent(createCharacter.sex);
  createCharacter.faceFather = getRandomParent(createCharacter.sex);
  createCharacter.skinMother = getRandomParent(createCharacter.sex);
  createCharacter.skinFather = getRandomParent();
  createCharacter.faceMix = getRandomResemblance(createCharacter.sex);
  createCharacter.skinMix = getRandomResemblance(createCharacter.sex);

  for (const idx in createCharacter.features) {
    createCharacter.features[idx] = getRandomFeatureValue();
  }

  createCharacter.hair = getRandomHair(createCharacter.sex);
  createCharacter.hairCollection = aspects(createCharacter.sex).Hair.options.get(
    createCharacter.hair
  )!.collection;
  createCharacter.hairOverlay = aspects(createCharacter.sex).Hair.options.get(
    createCharacter.hair
  )!.overlay;
  createCharacter.hairColor1 = getRandomHairColor();
  createCharacter.hairColor2 = getRandomHairHighlightColor();

  for (const [key, overlay] of createCharacter.headOverlays.entries()) {
    if (notRandomizableOverlaysForGender(createCharacter.sex).includes(key)) {
      continue;
    }

    overlay.value = getRandomOverlayItemValue(key);
    overlay.opacity = getRandomOverlayItemOpacity(key);

    if (headOverlays.get(key)?.color1) {
      overlay.color1 = getRandomOverlayColor(key);
    }
    if (headOverlays.get(key)?.color2) {
      overlay.color2 = getRandomOverlayColor(key);
    }
  }
}
</script>

<template>
  <Screen ref="screenRef">
    <NameAndSex
      class="absolute top-screen-1/10 left-1/2 -translate-x-1/2 flex flex-col justify-center items-center gap-6"
    />
    <div class="absolute top-screen-1/10 left-screen-1/10 w-96 flex flex-col gap-8">
      <FaceShape />
      <Features />
    </div>
    <div class="absolute top-screen-1/10 right-screen-1/10 w-96 flex flex-col gap-8">
      <FaceSkin />
      <Appearance />
    </div>
    <div class="absolute bottom-screen-1/10 left-1/2 -translate-x-1/2">
      <PlayButton />
    </div>
  </Screen>
</template>
