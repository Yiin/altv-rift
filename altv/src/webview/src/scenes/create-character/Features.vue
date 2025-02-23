<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { features, getRandomFeatureValue } from "@shared/modules/character/appearance-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCreateCharacter } from "../../store/create-character.store";
import SliderSelection from "../../components/SliderSelection.vue";
import Tabs from "../../components/Tabs/DefaultTabs.vue";
import XYSelection from "../../components/XYSelection.vue";
import XSelection from "../../components/XSelection.vue";

const createCharacter = useCreateCharacter();

const selectedFeature = ref<keyof typeof features>("Eyes");
const selectedTab = ref(0);

/**
 * Workaround for v-tabs not registering click events when the selected feature changes
 */
const featuresList = computed(() => [selectedFeature.value]);
const selectedFeatures = computed(() => features[selectedFeature.value]);

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
  <Card class="border-none bg-background/60">
    <CardContent class="p-6">
      <div class="flex items-center justify-between pb-4 text-sm font-bold uppercase tracking-wide">
        <span>Face features</span>
        <Button
          @click="randomize"
          variant="secondary"
          class="h-8 gap-2"
        >
          <i class="mdi mdi-shuffle-variant" />
          Random
        </Button>
      </div>
      <SliderSelection
        :options="Object.keys(features)"
        v-model="selectedFeature"
      />
      <Separator class="my-4" />
      <Tabs
        v-for="feature in featuresList"
        :key="feature"
        v-model="selectedTab"
        :options="selectedFeatures.map(({ name }) => name)"
        fixed-tabs
      />
      <div class="relative">
        <div
          v-for="tab in selectedFeatures"
          :key="tab.name"
          v-show="selectedTab === selectedFeatures.indexOf(tab)"
          class="transition-opacity duration-300"
          :class="selectedTab === selectedFeatures.indexOf(tab) ? 'opacity-100' : 'opacity-0'"
        >
          <XYSelection
            v-if="tab.y"
            v-model:x="createCharacter.currentAppearance.features[tab.x[0]]"
            v-model:y="createCharacter.currentAppearance.features[tab.y[0]]"
            :label-top="tab.y[1]"
            :label-bottom="tab.y[2]"
            :label-left="tab.x[1]"
            :label-right="tab.x[2]"
            :reverse-x="tab.x.length === 4 && tab.x[3]"
            :reverse-y="tab.y.length === 4 && tab.y[3]"
            class="my-2"
          />
          <XSelection
            v-else
            v-model="createCharacter.currentAppearance.features[tab.x[0]]"
            :label-left="tab.x[1]"
            :label-right="tab.x[2]"
            :reverse="tab.x.length === 4 && tab.x[3]"
            class="my-2"
          />
        </div>
      </div>
    </CardContent>
  </Card>
</template>
