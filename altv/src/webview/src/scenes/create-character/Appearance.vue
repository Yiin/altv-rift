<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  notRandomizableOverlaysForGender,
  Aspect,
  aspects,
  getRandomHair,
  getRandomHairColor,
  getRandomHairHighlightColor,
  getRandomOverlayColor,
  getRandomOverlayItemOpacity,
  getRandomOverlayItemValue,
  headOverlays,
} from "@shared/modules/character/appearance-data";
import { wrap } from "@/utils/wrap";
import { useCreateCharacter } from "../../store/create-character.store";
import SlideOption from "../../components/SlideOption.vue";
import SliderSelection from "../../components/SliderSelection.vue";
import ColorSelection from "../../components/ColorSelection.vue";
import Tabs from "../../components/Tabs/Tabs.vue";

const createCharacter = useCreateCharacter();

// Hair, SkinComplextion, EyeColor, Lipstick, etc.
const selectedAspect = ref(Aspect.Hair);

// Main color/highlight color
const selectedTab = ref(0);

// Used to get available options and colors of the selected aspect
const currentAspect = computed(() => aspects(createCharacter.sex)[selectedAspect.value]!);

// Ids of the available options of the selected aspect
const currentAspectValues = computed(() => Array.from(currentAspect.value.options.keys()));

const selectedAspectTabs = computed(() => {
  return [
    "color1" in currentAspect.value && "Main color",
    "color2" in currentAspect.value && "Highlight color",
  ].filter(Boolean) as string[];
});

watch(
  () => selectedAspect.value,
  () => {
    selectedTab.value = 0;
  },
);

watch(
  () => createCharacter.sex,
  (sex) => {
    while (!aspects(sex).Hair.options.has(createCharacter.currentAppearance.hair)) {
      createCharacter.currentAppearance.hair = wrap(
        createCharacter.currentAppearance.hair - 1,
        aspects(sex).Hair.options.size,
      );
    }
  },
);

function getCurrentAspectValueLabel(option: number): string {
  const value = currentAspect.value.options.get(option)!;

  if (typeof value === "string") {
    return value;
  }
  return value.name;
}

const randomize = () => {
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
};
</script>

<template>
  <v-card class="v-card--transparent">
    <v-card-item>
      <div class="flex items-center justify-between pb-4 text-sm font-bold uppercase tracking-wide">
        Appearance
        <v-btn
          @click="randomize"
          color="grey-darken-3"
          prepend-icon="mdi-shuffle-variant"
          size="small"
        >
          Random
        </v-btn>
      </div>
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
            v-model="createCharacter.currentAppearance.hair"
            :value-text="getCurrentAspectValueLabel"
          />
          <SlideOption
            v-else-if="selectedAspect === Aspect.EyeColor"
            :options="currentAspectValues"
            v-model="createCharacter.currentAppearance.eyes"
            :value-text="getCurrentAspectValueLabel"
          />
          <SlideOption
            v-else-if="currentAspect && 'overlayId' in currentAspect"
            :options="currentAspectValues"
            v-model="createCharacter.currentAppearance.headOverlays[currentAspect.overlayId]!.value"
            :value-text="getCurrentAspectValueLabel"
          />
        </div>
        <div class="flex flex-col gap-6">
          <div v-if="currentAspect && 'overlayId' in currentAspect">
            <div class="text-xs uppercase tracking-wide">Opacity</div>
            <v-slider
              v-model="
                createCharacter.currentAppearance.headOverlays[currentAspect.overlayId]!
                  .opacity as number
              "
              track-color="grey"
              color="white"
              min="0"
              max="1"
              :step="0.01"
              hide-details
            />
          </div>

          <Tabs
            v-if="selectedAspectTabs.length > 0"
            v-model="selectedTab"
            :options="selectedAspectTabs"
          />

          <v-window v-model="selectedTab">
            <v-window-item
              v-for="(tab, index) in selectedAspectTabs"
              :key="tab"
            >
              <ColorSelection
                key="color1"
                v-if="selectedAspect === Aspect.Hair && 'color1' in currentAspect && index === 0"
                :options="currentAspect.color1"
                v-model="createCharacter.currentAppearance.hairColor1"
                use-index-as-value
              />
              <ColorSelection
                key="color2"
                v-if="selectedAspect === Aspect.Hair && 'color2' in currentAspect && index === 1"
                :options="currentAspect.color2"
                v-model="createCharacter.currentAppearance.hairColor2"
                use-index-as-value
              />

              <ColorSelection
                :key="selectedAspect"
                v-if="
                  currentAspect &&
                  'overlayId' in currentAspect &&
                  'color1' in currentAspect &&
                  index === 0
                "
                :options="currentAspect.color1"
                v-model="
                  createCharacter.currentAppearance.headOverlays[currentAspect.overlayId]!.color1
                "
                use-index-as-value
              />
              <ColorSelection
                :key="selectedAspect"
                v-if="
                  currentAspect &&
                  'overlayId' in currentAspect &&
                  'color2' in currentAspect &&
                  index === 1
                "
                :options="currentAspect.color2"
                v-model="
                  createCharacter.currentAppearance.headOverlays[currentAspect.overlayId]!.color2
                "
                :value-text="
                  currentAspect.color2[
                    createCharacter.currentAppearance.headOverlays[currentAspect.overlayId]!.color2!
                  ].name
                "
                use-index-as-value
              />
            </v-window-item>
          </v-window>
        </div>
      </div>
    </v-card-item>
  </v-card>
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
