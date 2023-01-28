<script setup lang="ts">
import { computed, ref } from "vue";
import { useCreateCharacter } from "../../store/create-character.store";
import SlideOption from "../../components/SlideOption.vue";
import CreateCharacter from "./CreateCharacter.vue";
import { notRandomizableOverlaysForGender } from "./data/head-overlays";
import {
  Aspect,
  aspects,
  getRandomBeardColor,
  getRandomBlushColor,
  getRandomChestHairColor,
  getRandomEyebrowColor,
  getRandomHair,
  getRandomHairColor,
  getRandomHairHighlightColor,
  getRandomLipstickColor,
  getRandomOverlayColor,
  getRandomOverlayItemOpacity,
  getRandomOverlayItemValue,
} from "./data/aspects";
import SliderSelection from "../../components/SliderSelection.vue";
import ColorSelection from "../../components/ColorSelection.vue";
import { headOverlays, OverlayType } from "./data/overlays";

const createCharacter = useCreateCharacter();

// Hair, SkinComplextion, EyeColor, Lipstick, etc.
const selectedAspect = ref(Aspect.Hair);

// Used to get available options and colors of the selected aspect
const currentAspect = computed(
  () => aspects(createCharacter.sex)[selectedAspect.value]!
);

// Ids of the available options of the selected aspect
const currentAspectValues = computed(() =>
  Array.from(currentAspect.value.options.keys())
);

function getCurrentAspectValueLabel(option: number) {
  const value = currentAspect.value.options.get(option)!;

  if (typeof value === "string") {
    return value;
  }
  return value.name;
}

const randomize = () => {
  createCharacter.hair = getRandomHair(createCharacter.sex);
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
};
</script>

<template>
  <CreateCharacter title="Appearance">
    <SliderSelection
      :options="Object.keys(aspects(createCharacter.sex))"
      v-model="selectedAspect"
    />
    <v-divider />

    <div class="m-4">
      <div class="mb-4">
        <SlideOption
          v-if="selectedAspect === Aspect.Hair"
          :options="currentAspectValues"
          v-model="createCharacter.hair"
          :value-text="getCurrentAspectValueLabel"
        />
        <SlideOption
          v-else-if="selectedAspect === Aspect.EyeColor"
          :options="currentAspectValues"
          v-model="createCharacter.eyes"
          :value-text="getCurrentAspectValueLabel"
        />
        <SlideOption
          v-else-if="'overlayId' in currentAspect"
          :options="currentAspectValues"
          v-model="createCharacter.headOverlays.get(currentAspect.overlayId)!.value"
          :value-text="getCurrentAspectValueLabel"
        />
      </div>
      <div class="flex flex-col gap-6">
        <div v-if="'overlayId' in currentAspect">
          <div class="text-xs uppercase tracking-wide">Opacity</div>
          <v-slider
            v-model="createCharacter.headOverlays.get(currentAspect.overlayId)!.opacity"
            track-color="grey"
            min="0"
            max="1"
            :step="0.01"
            hide-details
          />
        </div>
        <ColorSelection
          :key="selectedAspect"
          v-if="selectedAspect === Aspect.Hair && 'color1' in currentAspect"
          label="Main color"
          :options="currentAspect.color1"
          v-model="createCharacter.hairColor1"
          use-index-as-value
        />
        <ColorSelection
          :key="selectedAspect"
          v-if="selectedAspect === Aspect.Hair && 'color2' in currentAspect"
          label="Highlight color"
          :options="currentAspect.color2"
          v-model="createCharacter.hairColor2"
          use-index-as-value
        />

        <ColorSelection
          :key="selectedAspect"
          v-if="'overlayId' in currentAspect && 'color1' in currentAspect"
          label="Main color"
          :options="currentAspect.color1"
          v-model="createCharacter.headOverlays.get(currentAspect.overlayId)!.color1"
          use-index-as-value
        />

        <ColorSelection
          :key="selectedAspect"
          v-if="'overlayId' in currentAspect && 'color2' in currentAspect"
          label="Highlight color"
          :options="currentAspect.color2"
          v-model="createCharacter.headOverlays.get(currentAspect.overlayId)!.color2"
          :value-text="currentAspect.color2[createCharacter.headOverlays.get(currentAspect.overlayId)!.color2!].name"
          use-index-as-value
        />
      </div>
    </div>

    <template #actions>
      <v-list :lines="false" density="comfortable" nav>
        <v-list-item @click="randomize" density="comfortable" nav>
          <template v-slot:prepend>
            <v-icon icon="mdi-shuffle-variant" />
          </template>

          <v-list-item-title class="select-none"> Randomize </v-list-item-title>
        </v-list-item>
      </v-list>
      <v-divider />
    </template>
  </CreateCharacter>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-to,
.list-leave-from {
  height: 88px;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  height: 0;
  margin-top: calc(theme("spacing.4") * -1);
  transform: translateY(-30px);
}
</style>
