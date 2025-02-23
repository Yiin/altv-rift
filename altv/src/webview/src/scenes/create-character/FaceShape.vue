<script setup lang="ts">
import {
  parents,
  getRandomParent,
  getRandomResemblance,
} from "@shared/modules/character/appearance-data";
import { px } from "@/composables/use-pixel";
import { asset } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "@/components/Image.vue";
import { useCreateCharacter } from "../../store/create-character.store";
import SlideOption from "../../components/SlideOption.vue";
import XSelection from "../../components/XSelection.vue";

const createCharacter = useCreateCharacter();

const randomFace = () => {
  createCharacter.currentAppearance.faceMother = getRandomParent(createCharacter.sex);
  createCharacter.currentAppearance.faceFather = getRandomParent();
  createCharacter.currentAppearance.faceMix = getRandomResemblance(createCharacter.sex);
};
</script>

<template>
  <Card class="border-none bg-background/60">
    <CardContent class="p-6">
      <div class="flex items-center justify-between pb-2 text-sm font-bold uppercase tracking-wide">
        <span>Face shape</span>
        <Button
          @click="randomFace"
          variant="secondary"
          class="h-8 gap-2"
        >
          <i class="mdi mdi-shuffle-variant" />
          Random
        </Button>
      </div>
      <div class="pointer-events-none flex items-end justify-center">
        <Image
          :src="asset(`assets/faces/${createCharacter.currentAppearance.faceMother}.webp`)"
          :style="{
            height: `${px(150)}px`,
          }"
          class="z-10 -mr-10 flex object-bottom transition-all duration-100"
          alt="Mother's face"
        />

        <Image
          :src="asset(`assets/faces/${createCharacter.currentAppearance.faceFather}.webp`)"
          :style="{
            height: `${px(150)}px`,
          }"
          class="object-bottom transition-all duration-100"
          alt="Father's face"
        />
      </div>
      <div class="p-2 pt-0">
        <XSelection
          :size="300"
          :min="0"
          :max="1"
          v-model="createCharacter.currentAppearance.faceMix"
          no-padding
          class="mb-2"
        />
        <div class="grid grid-cols-2 gap-4">
          <div>
            <SlideOption
              v-model="createCharacter.currentAppearance.faceMother"
              :options="
                Array.from(parents.keys()).filter(
                  (parent) => parent !== createCharacter.currentAppearance.faceFather,
                )
              "
              :value-text="(value) => parents[value]"
            />
          </div>
          <div>
            <SlideOption
              v-model="createCharacter.currentAppearance.faceFather"
              :options="
                Array.from(parents.keys()).filter(
                  (parent) => parent !== createCharacter.currentAppearance.faceMother,
                )
              "
              :value-text="(value) => parents[value]"
            />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
