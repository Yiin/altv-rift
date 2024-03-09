<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { useCreateCharacter } from "@/store/create-character.store";
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
  getRandomResemblance
} from "@shared/modules/character/appearance-data";
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

useEventListener("pointerup", (e) => {
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

  for (const [key, overlay] of createCharacter.currentAppearance.headOverlays.entries()) {
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
      class="absolute top-screen-1/10 left-1/2 -translate-x-1/2 flex flex-col justify-center items-center gap-6" />
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
