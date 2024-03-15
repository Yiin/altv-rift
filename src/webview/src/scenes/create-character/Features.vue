<script setup lang="ts">
import { ref, watch } from "vue";
import { features, getRandomFeatureValue } from "@shared/modules/character/appearance-data";
import { useCreateCharacter } from "../../store/create-character.store";
import SliderSelection from "../../components/SliderSelection.vue";
import Tabs from "../../components/Tabs/Tabs.vue";
import XYSelection from "../../components/XYSelection.vue";
import XSelection from "../../components/XSelection.vue";

const createCharacter = useCreateCharacter();

const selectedFeature = ref<keyof typeof features>("Eyes");
const selectedTab = ref(0);

watch(selectedFeature, () => {
  selectedTab.value = 0;
});

const randomize = () => {
  for (const idx in createCharacter.currentAppearance.features) {
    createCharacter.currentAppearance.features[idx] = getRandomFeatureValue();
  }
};
</script>

<template>
  <v-card class="v-card--transparent">
    <v-card-item>
      <div class="flex items-center justify-between pb-4 text-sm font-bold uppercase tracking-wide">
        Face features
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
        :options="Object.keys(features)"
        v-model="selectedFeature"
      />
      <v-divider />
      <Tabs
        v-model="selectedTab"
        :options="features[selectedFeature].map(({ name }) => name)"
        fixed-tabs
      />
      <v-window v-model="selectedTab">
        <v-window-item
          v-for="tab in features[selectedFeature]"
          :key="tab.name"
        >
          <XYSelection
            v-if="'y' in tab"
            v-model:x="createCharacter.currentAppearance.features[tab.x[0]]"
            v-model:y="createCharacter.currentAppearance.features[tab.y[0]]"
            :label-top="tab.y[1]"
            :label-bottom="tab.y[2]"
            :label-left="tab.x[1]"
            :label-right="tab.x[2]"
            class="my-2"
          />
          <XSelection
            v-else
            v-model="createCharacter.currentAppearance.features[tab.x[0]]"
            :label-left="tab.x[1]"
            :label-right="tab.x[2]"
            class="my-2"
          />
        </v-window-item>
      </v-window>
    </v-card-item>
  </v-card>
</template>
