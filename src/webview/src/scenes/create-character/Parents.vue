<script setup lang="ts">
import { ref, computed, effect, Teleport } from "vue";
import colors from "vuetify/lib/util/colors";
import chroma from "chroma-js";
import { useCreateCharacter } from "../../store/create-character.store";
import { asset } from "../../utils/asset";
import {
  fathers,
  getRandomFather,
  getRandomMother,
  getRandomResemblance,
  mothers,
} from "./data/parents";
import CreateCharacter from "./CreateCharacter.vue";

const createCharacter = useCreateCharacter();

const father = computed(() =>
  fathers.findIndex(({ id }) => id === createCharacter.faceFather)
);
const mother = computed(() =>
  mothers.findIndex(({ id }) => id === createCharacter.faceMother)
);

const motherImage = computed(() =>
  asset(`./assets/parents/parent_female_${mother.value}.png`, import.meta.url)
);
const fatherImage = computed(() =>
  asset(`./assets/parents/parent_male_${father.value}.png`, import.meta.url)
);

const skinMixColor = computed(() =>
  chroma
    .mix(
      colors.pink.lighten1,
      colors.indigo.lighten1,
      createCharacter.skinMix / 100
    )
    .hex("rgb")
);

const faceMixColor = computed(() =>
  chroma
    .mix(
      colors.pink.lighten1,
      colors.indigo.lighten1,
      createCharacter.faceMix / 100
    )
    .hex("rgb")
);

const prevFather = () => {
  createCharacter.faceFather =
    fathers[father.value ? father.value - 1 : fathers.length - 1].id;
};
const nextFather = () => {
  createCharacter.faceFather =
    fathers[father.value < fathers.length - 1 ? father.value + 1 : 0].id;
};
const prevMother = () => {
  createCharacter.faceMother =
    mothers[mother.value ? mother.value - 1 : mothers.length - 1].id;
};
const nextMother = () => {
  createCharacter.faceMother =
    mothers[mother.value < mothers.length - 1 ? mother.value + 1 : 0].id;
};

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
          :src="motherImage"
        />
        <v-img
          class="parent-image"
          transition="parent-fade"
          height="150"
          :src="fatherImage"
        />
      </div>
      <v-container>
        <v-row align="center">
          <v-col cols="4"> Mother </v-col>
          <v-col cols="8" class="flex justify-between items-center w-100">
            <v-btn icon="mdi-chevron-left" size="x-small" @click="prevMother" />
            <span class="px-5">{{ mothers[mother].name }}</span>
            <v-btn
              icon="mdi-chevron-right"
              size="x-small"
              @click="nextMother"
            />
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="4"> Father </v-col>
          <v-col cols="8" class="flex justify-between items-center w-100">
            <v-btn icon="mdi-chevron-left" size="x-small" @click="prevFather" />
            <span class="px-5">{{ fathers[father].name }}</span>
            <v-btn
              icon="mdi-chevron-right"
              size="x-small"
              @click="nextFather"
            />
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="4"> Skin </v-col>
          <v-col cols="8" class="flex justify-between items-center w-100">
            <v-slider
              v-model="createCharacter.skinMix"
              :color="skinMixColor"
              track-color="grey"
              min="0"
              max="1"
              :step="0.01"
              hide-details
            >
              <template v-slot:append>
                <div class="w-8 text-right">
                  {{ ~~(createCharacter.skinMix * 100) }}
                </div>
              </template>
            </v-slider>
          </v-col>
        </v-row>
        <v-row align="center">
          <v-col cols="4"> Face </v-col>
          <v-col cols="8" class="flex justify-between items-center w-100">
            <v-slider
              v-model="createCharacter.faceMix"
              :color="faceMixColor"
              track-color="grey"
              min="0"
              max="1"
              :step="0.01"
              hide-details
            >
              <template v-slot:append>
                <div class="w-8 text-right">
                  {{ ~~(createCharacter.faceMix * 100) }}
                </div>
              </template>
            </v-slider>
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
