<script setup lang="ts">
import { effect } from "vue";
import { useCreateCharacter } from "../../store/create-character.store";
import {
  parents,
  getRandomFather,
  getRandomMother,
  getRandomResemblance,
} from "./data/parents";
import CreateCharacter from "./CreateCharacter.vue";
import SlideOption from "../../components/SlideOption.vue";
import XSelection from "../../components/XSelection.vue";

const createCharacter = useCreateCharacter();

const randomize = () => {
  createCharacter.faceMother = getRandomMother();
  createCharacter.faceFather = getRandomFather();
  createCharacter.faceMix = getRandomResemblance(createCharacter.sex);
  createCharacter.skinMix = getRandomResemblance();
};
</script>

<template>
  <CreateCharacter title="Parents">
    <v-card-item>
      <div class="flex justify-center items-end mb-2">
        <v-img
          transition="parent-fade"
          class="-mr-10 flex z-10 parent-image"
          height="150"
          :src="`/assets/parents/parent_${createCharacter.faceMother}.png`"
        />
        <v-img
          class="parent-image"
          transition="parent-fade"
          height="150"
          :src="`/assets/parents/parent_${createCharacter.faceFather}.png`"
        />
      </div>
      <v-container>
        <v-row align="center">
          <v-col cols="4">
            <span class="text-xs pb-2 uppercase tracking-wide"> Parent 1 </span>
          </v-col>
          <v-col cols="8">
            <SlideOption
              v-model="createCharacter.faceMother"
              :options="Array.from(parents.keys())"
              :value-text="(value) => parents[value]"
            />
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="4">
            <span class="text-xs pb-2 uppercase tracking-wide"> Parent 2 </span>
          </v-col>
          <v-col cols="8">
            <SlideOption
              v-model="createCharacter.faceFather"
              :options="Array.from(parents.keys())"
              :value-text="(value) => parents[value]"
            />
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="4">
            <span class="text-xs pb-2 uppercase tracking-wide"> Skin </span>
          </v-col>
          <v-col cols="8" class="flex justify-between items-center w-100">
            <XSelection
              :min="0"
              :max="1"
              v-model="createCharacter.skinMix"
              no-padding
            />
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="4">
            <span class="text-xs pb-2 uppercase tracking-wide"> Face </span>
          </v-col>
          <v-col cols="8" class="flex justify-between items-center w-100">
            <XSelection
              :min="0"
              :max="1"
              v-model="createCharacter.faceMix"
              no-padding
            />
          </v-col>
        </v-row>
      </v-container>
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
