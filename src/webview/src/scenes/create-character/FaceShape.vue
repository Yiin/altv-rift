<script setup lang="ts">
import { useCreateCharacter } from "../../store/create-character.store";
import { parents, getRandomParent, getRandomResemblance } from "@shared/modules/character/appearance-data";
import SlideOption from "../../components/SlideOption.vue";
import XSelection from "../../components/XSelection.vue";
import { px } from "@/composables/use-pixel";

const createCharacter = useCreateCharacter();

const randomFace = () => {
  createCharacter.currentAppearance.faceMother = getRandomParent(createCharacter.sex);
  createCharacter.currentAppearance.faceFather = getRandomParent();
  createCharacter.currentAppearance.faceMix = getRandomResemblance(createCharacter.sex);
};
</script>

<template>
  <v-card class="v-card--transparent">
    <v-card-item>
      <div class="text-sm font-bold pb-2 uppercase tracking-wide flex justify-between items-center">
        Face shape
        <v-btn @click="randomFace" color="grey-darken-3" prepend-icon="mdi-shuffle-variant" size="small">
          Random
        </v-btn>
      </div>
      <div class="flex justify-center items-end pointer-events-none">
        <v-img transition="parent-fade" class="-mr-10 flex z-10 parent-image" :height="px(150)"
          :src="`./assets/faces/${createCharacter.currentAppearance.faceMother}.png`" />
        <v-img class="parent-image" transition="parent-fade" :height="px(150)"
          :src="`./assets/faces/${createCharacter.currentAppearance.faceFather}.png`" />
      </div>
      <div class="p-2 pt-0">
        <XSelection :size="300" :min="0" :max="1" v-model="createCharacter.currentAppearance.faceMix" no-padding
          class="mb-2" />
        <v-row align="center">
          <v-col cols="6">
            <SlideOption v-model="createCharacter.currentAppearance.faceMother" :options="Array.from(parents.keys()).filter(
              (parent) => parent !== createCharacter.currentAppearance.faceFather
            )
              " :value-text="(value) => parents[value]" />
          </v-col>
          <v-col cols="6">
            <SlideOption v-model="createCharacter.currentAppearance.faceFather" :options="Array.from(parents.keys()).filter(
              (parent) => parent !== createCharacter.currentAppearance.faceMother
            )
              " :value-text="(value) => parents[value]" />
          </v-col>
        </v-row>
      </div>
    </v-card-item>
  </v-card>
</template>

<style>
.parent-fade-enter-active,
.parent-fade-leave-active {
  transition: all 0.1s ease-out;
}

.parent-fade-enter-from,
.parent-fade-leave-to {
  all: unset;
  height: 0;
  opacity: 0;
}

.parent-image .v-img__img {
  top: unset;
  bottom: 0;
}
</style>
