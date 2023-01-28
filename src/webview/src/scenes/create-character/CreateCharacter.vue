<script setup lang="ts">
import { clamp } from "lodash";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import Focusable from "../../components/Focusable.vue";
import { useEventListener } from "../../composables/use-event-listener";
import { useCreateCharacter } from "../../store/create-character.store";
import {
  getRandomHair,
  getRandomHairColor,
  getRandomHairHighlightColor,
  getRandomOverlayColor,
  getRandomOverlayItemOpacity,
  getRandomOverlayItemValue,
} from "./data/aspects";
import { getRandomFeatureValue } from "./data/features";
import { notRandomizableOverlaysForGender } from "./data/head-overlays";
import { headOverlays } from "./data/overlays";
import {
  getRandomMother,
  getRandomFather,
  getRandomResemblance,
} from "./data/parents";
import { Events } from "../../../../shared/constants/events";

const props = defineProps<{ title: string; contentClass?: string }>();

const route = useRoute();
const createCharacter = useCreateCharacter();

watch(createCharacter, () => {
  alt.emit(Events.Client.UPDATE_CHARACTER_APPEARANCE, createCharacter.$state);
});

const isSexFocused = ref(false);

useEventListener(
  "keydown",
  (e) => {
    if (e.key === "ArrowLeft") {
      createCharacter.sex = clamp(createCharacter.sex - 1, 0, 1) as 0 | 1;
    } else if (e.key === "ArrowRight") {
      createCharacter.sex = clamp(createCharacter.sex + 1, 0, 1) as 0 | 1;
    }
  },
  {
    isActive: isSexFocused,
  }
);

function randomize() {
  createCharacter.faceMother = getRandomMother();
  createCharacter.faceFather = getRandomFather();
  createCharacter.faceMix = getRandomResemblance(createCharacter.sex);
  createCharacter.skinMix = getRandomResemblance();

  for (const idx in createCharacter.features) {
    createCharacter.features[idx] = getRandomFeatureValue();
  }

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
}
</script>

<template>
  <v-card class="mx-auto mt-screen-1/10 select-none" max-width="344" flat>
    <v-card-item>
      <div class="text-overline mb-1">{{ props.title }}</div>
    </v-card-item>
    <Focusable v-model="isSexFocused" class="mb-3">
      <v-tabs v-model="createCharacter.sex" fixed-tabs bg-color="#444444">
        <v-tab :value="0">
          <v-icon
            :color="!createCharacter.sex ? 'light-blue' : 'white'"
            size="x-large"
          >
            mdi-gender-male
          </v-icon>
        </v-tab>
        <v-tab :value="1">
          <v-icon
            :color="createCharacter.sex ? 'pink-lighten-1' : 'white'"
            size="x-large"
          >
            mdi-gender-female
          </v-icon>
        </v-tab>
      </v-tabs>
    </Focusable>

    <div :class="['create-character-card', props.contentClass]">
      <slot />
    </div>

    <v-divider />

    <v-card-item>
      <slot name="actions" />

      <v-list :lines="false" density="comfortable" nav>
        <v-list-item
          v-if="route.name !== 'CreateCharacter'"
          to="/create-character"
        >
          <template v-slot:prepend>
            <v-icon icon="mdi-chevron-left" />
          </template>

          <v-list-item-title class="select-none">
            Back to menu
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-else @click="randomize" density="comfortable" nav>
          <template v-slot:prepend>
            <v-icon icon="mdi-shuffle-variant" />
          </template>
          <v-list-item-title class="select-none"> Randomize </v-list-item-title>
        </v-list-item>
        <v-list-item to="#" color="secondary">
          <template v-slot:prepend>
            <v-icon icon="mdi-account-check" />
          </template>

          <v-list-item-title
            @click="createCharacter.submit"
            class="select-none"
          >
            Create character
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-item>
  </v-card>
</template>

<style>
.create-character-card {
  max-height: 60vh;
}
</style>
