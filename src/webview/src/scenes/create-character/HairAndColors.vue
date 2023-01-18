<script setup lang="ts">
import { computed, ref } from "vue";
import SlideOption from "../../components/SlideOption.vue";
import { useCreateCharacter } from "../../store/create-character.store";
import CreateCharacter from "./CreateCharacter.vue";
import { blushColors, eyeColors, hairList } from "./data/hair-and-colors";
import { headOverlays, OverlayType } from "./data/overlays";

const createCharacter = useCreateCharacter();

const blush = computed(
  () => createCharacter.headOverlays.get(OverlayType.Blush)!
);
const lipstick = computed(
  () => createCharacter.headOverlays.get(OverlayType.Lipstick)!
);

const colors = computed(() =>
  Array.from(createCharacter.headOverlays.keys())
    .filter((type) => headOverlays.get(type).color1)
    .map((type) => [type, headOverlays.get(type).color1!] as const)
    .reduce(
      (acc, [type, color1]) => ({
        ...acc,
        [type]: Array.from(
          Array(color1.max - color1.min + 1),
          (_, i) => i + color1.min
        ),
      }),
      {} as Record<OverlayType, number[]>
    )
);
</script>

<template>
  <CreateCharacter title="Hair & Colors">
    <v-card-item>
      <v-card>
        <v-card-text class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <span>Hair</span>
            <SlideOption
              :options="Array.from(hairList[createCharacter.sex].keys())"
              v-model="createCharacter.hair"
              :valueText="
                hairList[createCharacter.sex].get(createCharacter.hair)?.name
              "
            />
          </div>
          <div class="flex flex-col gap-1">
            <span>Eye color</span>
            <SlideOption
              :options="Array.from(eyeColors.keys())"
              v-model="createCharacter.eyes"
              :valueText="eyeColors[createCharacter.eyes]"
            />
          </div>
          <div class="flex flex-col gap-1">
            <span> {{ headOverlays.get(OverlayType.Blush).label }}</span>
            <SlideOption
              :options="Array.from(blushColors.keys())"
              v-model="blush.color1"
              :valueText="
                blushColors.get(blush.color1!)
              "
            />
          </div>
          <div class="flex flex-col gap-1">
            <span> {{ headOverlays.get(OverlayType.Lipstick).label }}</span>
            <SlideOption
              :options="colors[OverlayType.Lipstick]"
              v-model="lipstick.color1"
              :valueText="
                blushColors.get(lipstick.color1!)
              "
            />
          </div>
        </v-card-text>
      </v-card>
    </v-card-item>
  </CreateCharacter>
</template>
