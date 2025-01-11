<script setup lang="ts">
import { ref, watch } from "vue";
import { Gender } from "@shared/modules/character/appearance-data/aspects";
import { useEventListener } from "@/composables/use-event-listener";
import { useCreateCharacter } from "../../store/create-character.store";

const createCharacter = useCreateCharacter();

const nameInputRef = ref<HTMLInputElement>();
const nameInputWidthRef = ref<HTMLSpanElement>();
const nameInputWidth = ref(0);

useEventListener("pointerup", () => {
  nameInputRef.value?.focus();
});

watch(
  () => createCharacter.name,
  () => {
    delete createCharacter.errors.name;

    requestAnimationFrame(() => {
      nameInputWidth.value = nameInputWidthRef.value?.offsetWidth ?? 0;
    });
  },
);

watch(
  () => createCharacter.errors,
  () => {
    if (createCharacter.errors.name) {
      nameInputRef.value?.focus();
    }
  },
);
</script>

<template>
  <div>
    <v-card class="v-card--transparent">
      <v-card-item>
        <div class="flex flex-col p-4">
          <input
            ref="nameInputRef"
            type="text"
            v-model="createCharacter.name"
            class="min-w-52 rounded-md text-4xl outline-none"
            :style="{
              width: nameInputWidth + 'px',
            }"
            spellcheck="false"
          />
          <span
            ref="nameInputWidthRef"
            class="invisible absolute h-0 w-fit text-4xl"
          >
            {{ createCharacter.name }}
          </span>
          <v-divider
            :class="['my-1', createCharacter.errors.name && 'border-1 border-red-500 opacity-100']"
          />
          <span
            v-if="createCharacter.errors.name"
            class="text-sm font-bold uppercase tracking-wider text-red-500"
          >
            {{ createCharacter.errors.name }}
          </span>
          <span
            v-else
            class="text-sm uppercase tracking-wider"
          >
            Name of your character
          </span>
        </div>
      </v-card-item>
    </v-card>
    <div class="flex gap-8">
      <button
        type="button"
        class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-600 hover:bg-gray-700"
        @click="createCharacter.sex = Gender.MALE"
      >
        <Icon
          icon="mdi-gender-male"
          width="2.5rem"
          height="2.5rem"
          color="white"
        />
      </button>

      <v-btn
        size="5rem"
        icon
        :color="createCharacter.sex === Gender.MALE ? 'blue-grey' : 'grey-lighten-1'"
      >
        <v-icon
          icon="mdi-gender-male"
          size="2.5rem"
          color="white"
        />
      </v-btn>
      <v-btn
        @click="createCharacter.sex = Gender.FEMALE"
        size="5rem"
        icon
        :color="createCharacter.sex === Gender.FEMALE ? 'pink-lighten-1' : 'grey-lighten-1'"
      >
        <v-icon
          icon="mdi-gender-female"
          size="2.5rem"
          color="white"
        />
      </v-btn>
    </div>
  </div>
</template>
