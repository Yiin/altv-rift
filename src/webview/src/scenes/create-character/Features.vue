<script setup lang="ts">
import { useCreateCharacter } from "../../store/create-character.store";
import { features, getRandomFeatureValue } from "./data/features";
import CreateCharacter from "./CreateCharacter.vue";
import { ref, watch } from "vue";
import XSelection from "../../components/XSelection.vue";
import XYSelection from "../../components/XYSelection.vue";
import SliderSelection from "../../components/SliderSelection.vue";
import Tabs from "../../components/Tabs/Tabs.vue";

const createCharacter = useCreateCharacter();

const selectedFeature = ref<keyof typeof features>("Eyes");
const selectedTab = ref(0);
const x = ref(0);
const y = ref(0);

watch(selectedFeature, () => {
  selectedTab.value = 0;
});

const randomize = () => {
  for (const idx in createCharacter.features) {
    createCharacter.features[idx] = getRandomFeatureValue();
  }
};
</script>

<template>
  <CreateCharacter title="Face features" content-class="max-h-screen-1/5">
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

    <template #actions>
      <v-window v-model="selectedTab">
        <v-window-item v-for="tab in features[selectedFeature]">
          <XYSelection
            v-if="'y' in tab"
            v-model:x="createCharacter.features[tab.x[0]]"
            v-model:y="createCharacter.features[tab.y[0]]"
            :label-top="tab.y[1]"
            :label-bottom="tab.y[2]"
            :label-left="tab.x[1]"
            :label-right="tab.x[2]"
            class="my-2"
          />
          <XSelection
            v-else
            v-model="createCharacter.features[tab.x[0]]"
            :label-left="tab.x[1]"
            :label-right="tab.x[2]"
            class="my-2"
          />
        </v-window-item>
      </v-window>
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
