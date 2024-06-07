<script setup lang="ts">
import {
  parents,
  getRandomParent,
  getRandomResemblance,
} from "@shared/modules/character/appearance-data";
import { px } from "@/composables/use-pixel";
import { asset } from "@/utils/asset";
import { useCreateCharacter } from "../../store/create-character.store";
import SlideOption from "../../components/SlideOption.vue";
import XSelection from "../../components/XSelection.vue";

const createCharacter = useCreateCharacter();

const randomSkin = () => {
  createCharacter.currentAppearance.skinMother = getRandomParent(createCharacter.sex);
  createCharacter.currentAppearance.skinFather = getRandomParent();
  createCharacter.currentAppearance.skinMix = getRandomResemblance(createCharacter.sex);
};
</script>

<template>
  <v-card class="v-card--transparent">
    <v-card-item>
      <div class="flex items-center justify-between pb-2 text-sm font-bold uppercase tracking-wide">
        Skin
        <v-btn
          @click="randomSkin"
          color="grey-darken-3"
          prepend-icon="mdi-shuffle-variant"
          size="small"
        >
          Random
        </v-btn>
      </div>
      <div class="pointer-events-none flex items-end justify-center">
        <v-img
          transition="parent-fade"
          class="parent-image z-10 -mr-10 flex"
          :height="px(150)"
          :src="asset(`assets/faces/${createCharacter.currentAppearance.skinMother}.webp`)"
        />
        <v-img
          class="parent-image"
          transition="parent-fade"
          :height="px(150)"
          :src="asset(`assets/faces/${createCharacter.currentAppearance.skinFather}.webp`)"
        />
      </div>
      <div class="p-2 pt-0">
        <XSelection
          :size="300"
          :min="0"
          :max="1"
          v-model="createCharacter.currentAppearance.skinMix"
          no-padding
          class="mb-2"
        />
        <v-row align="center">
          <v-col cols="6">
            <SlideOption
              v-model="createCharacter.currentAppearance.skinMother"
              :options="
                Array.from(parents.keys()).filter(
                  (parent) => parent !== createCharacter.currentAppearance.skinFather,
                )
              "
              :value-text="(value) => parents[value]"
            />
          </v-col>
          <v-col cols="6">
            <SlideOption
              v-model="createCharacter.currentAppearance.skinFather"
              :options="
                Array.from(parents.keys()).filter(
                  (parent) => parent !== createCharacter.currentAppearance.skinMother,
                )
              "
              :value-text="(value) => parents[value]"
            />
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
