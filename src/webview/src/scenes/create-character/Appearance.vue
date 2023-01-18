<script setup lang="ts">
import { computed } from "vue";
import { useCreateCharacter } from "../../store/create-character.store";
import SlideOption from "../../components/SlideOption.vue";
import CreateCharacter from "./CreateCharacter.vue";
import {
  headOverlayNames,
  headOverlayItemNames,
  hiddenOverlaysForGender,
  notRandomizableOverlaysForGender,
  getRandomOverlayItemValue,
  getRandomOverlayItemOpacity,
} from "./data/head-overlays";

const createCharacter = useCreateCharacter();

const filteredHeadOverlays = computed(() =>
  headOverlayNames.reduce((obj, name, index) => {
    if (hiddenOverlaysForGender(createCharacter.sex).includes(index))
      return obj;
    return obj.set(index, name);
  }, new Map<number, string>())
);

const randomize = () => {
  [...filteredHeadOverlays.value.keys()]
    .filter(
      (overlayIndex) =>
        !notRandomizableOverlaysForGender(createCharacter.sex).includes(
          +overlayIndex
        )
    )
    .forEach((overlayIndex) => {
      createCharacter.opacityOverlays[overlayIndex].value =
        getRandomOverlayItemValue(overlayIndex);
      createCharacter.opacityOverlays[overlayIndex].opacity =
        getRandomOverlayItemOpacity(overlayIndex);
    });
};
</script>

<template>
  <CreateCharacter title="Appearance">
    <v-card-item>
      <v-card>
        <v-card-text class="flex flex-col gap-4">
          <transition-group name="list">
            <div v-for="[id, overlayName] of filteredHeadOverlays" :key="id">
              <div class="pb-1">{{ overlayName }}</div>
              <SlideOption
                :options="[...headOverlayItemNames[id].keys()]"
                v-model="createCharacter.opacityOverlays[id].value"
                :value-text="
                  headOverlayItemNames[id].get(
                    createCharacter.opacityOverlays[id].value
                  )
                "
              />
              <v-slider
                v-model="createCharacter.opacityOverlays[id].opacity"
                track-color="grey"
                min="0"
                max="1"
                :step="0.01"
                hide-details
              />
            </div>
          </transition-group>
        </v-card-text>
      </v-card>
    </v-card-item>
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
