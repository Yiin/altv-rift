<script setup lang="ts">
import { ref, watch } from "vue";
import { useCreateCharacter } from "../../store/create-character.store";

const createCharacter = useCreateCharacter();

const nameInputWidthRef = ref<HTMLSpanElement>();
const nameInputWidth = ref(0);

watch(
  () => createCharacter.name,
  () => {
    requestAnimationFrame(() => {
      nameInputWidth.value = nameInputWidthRef.value?.offsetWidth ?? 0;
    });
  }
);
</script>

<template>
  <div>
    <v-card class="v-card--transparent">
      <v-card-item>
        <div class="flex flex-col p-4">
          <input
            type="text"
            v-model="createCharacter.name"
            class="min-w-52 text-4xl rounded-md outline-none"
            :style="{
              width: nameInputWidth + 'px',
            }"
            spellcheck="false"
          />
          <span
            ref="nameInputWidthRef"
            class="absolute invisible text-4xl h-0 w-fit"
          >
            {{ createCharacter.name }}
          </span>
          <v-divider class="my-1" />
          <span class="uppercase text-sm tracking-wider">
            Name of your character
          </span>
        </div>
      </v-card-item>
    </v-card>
    <div class="flex gap-8">
      <v-btn
        @click="createCharacter.sex = 0"
        size="5rem"
        icon
        :color="!createCharacter.sex ? 'blue-grey' : 'grey-lighten-1'"
      >
        <v-icon icon="mdi-gender-male" size="2.5rem" color="white" />
      </v-btn>
      <v-btn
        @click="createCharacter.sex = 1"
        size="5rem"
        icon
        :color="createCharacter.sex ? 'pink-lighten-1' : 'grey-lighten-1'"
      >
        <v-icon icon="mdi-gender-female" size="2.5rem" color="white" />
      </v-btn>
    </div>
  </div>
</template>
