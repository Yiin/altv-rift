<script setup lang="ts">
import { useCreateCharacter } from "../../store/create-character.store";
import { features, getRandomFeatureValue } from "./data/features";
import CreateCharacter from "./CreateCharacter.vue";
import { computed, ref, watch } from "vue";
import XSelection from "../../components/XSelection.vue";
import XYSelection from "../../components/XYSelection.vue";
import SlideOption from "../../components/SlideOption.vue";
import SliderSelection from "../../components/SliderSelection.vue";

const createCharacter = useCreateCharacter();

const selectedFeature = ref<keyof typeof features>("Eyes");
const selectedTab = ref(0);
const x = ref(0);
const y = ref(0);

watch(createCharacter, () => {
  console.log("createCharacter changed", createCharacter.features);
});

watch(selectedFeature, () => {
  selectedTab.value = 0;
});

// export const featuresNames = {
//   "Nose Width": 0,
//   "Nose Bottom Height": 1,
//   "Nose Tip Length": 2,
//   "Nose Bridge Depth": 3,
//   "Nose Tip Height": 4,
//   "Nose Broken": 5,
//   "Brow Height": 6,
//   "Brow Depth": 7,
//   "Cheekbone Height": 8,
//   "Cheekbone Width": 9,
//   "Cheek Depth": 10,
//   "Eye Size": 11,
//   "Lip Thickness": 12,
//   "Jaw Width": 13,
//   "Jaw Shape": 14,
//   "Chin Height": 15,
//   "Chin Depth": 16,
//   "Chin Width": 17,
//   "Chin Indent": 18,
//   "Neck Width": 19,
// };

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
    <v-item-group v-model="selectedFeature" mandatory>
      <v-item
        v-for="feature in Object.keys(features)"
        :value="feature"
        v-slot="{ isSelected }"
      >
        <v-tabs v-if="isSelected" v-model="selectedTab" class="mb-5" fixed-tabs>
          <v-tab
            v-for="(tab, index) in features[selectedFeature]"
            @focus="selectedTab = index"
          >
            {{ tab.name }}
          </v-tab>
        </v-tabs>
      </v-item>
    </v-item-group>

    <template #actions>
      <v-item-group v-model="selectedFeature" mandatory>
        <v-item
          v-for="feature in Object.keys(features)"
          :value="feature"
          v-slot="{ isSelected }"
        >
          <v-window v-if="isSelected" v-model="selectedTab">
            <v-window-item v-for="tab in features[selectedFeature]">
              <XYSelection
                v-if="'y' in tab"
                v-model:x="createCharacter.features[tab.x[0]]"
                v-model:y="createCharacter.features[tab.y[0]]"
                :label-top="tab.y[1]"
                :label-bottom="tab.y[2]"
                :label-left="tab.x[1]"
                :label-right="tab.x[2]"
                class="mb-2"
              />
              <XSelection
                v-else
                v-model="createCharacter.features[tab.x[0]]"
                :label-left="tab.x[1]"
                :label-right="tab.x[2]"
                class="mb-2"
              />
            </v-window-item>
          </v-window>
        </v-item>
      </v-item-group>
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
