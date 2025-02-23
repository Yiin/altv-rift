<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { Gender } from "@shared/modules/character/appearance-data/aspects";
import { useEventListener } from "@/composables/use-event-listener";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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

const separatorClass = computed(() =>
  createCharacter.errors.name ? "my-1 border-1 border-red-500 opacity-100" : "my-1",
);
</script>

<template>
  <div>
    <Card class="bg-background/60">
      <CardContent>
        <div class="flex flex-col p-4">
          <input
            ref="nameInputRef"
            type="text"
            v-model="createCharacter.name"
            class="min-w-52 rounded-md bg-transparent text-4xl outline-none"
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
          <Separator :class="separatorClass" />
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
      </CardContent>
    </Card>
    <div class="flex gap-8">
      <button
        type="button"
        class="flex h-16 w-16 items-center justify-center rounded-full"
        :class="
          createCharacter.sex === Gender.MALE
            ? 'bg-red-700 hover:bg-red-800'
            : 'bg-gray-600 hover:bg-gray-700'
        "
        @click="createCharacter.sex = Gender.MALE"
      >
        <i-mdi-gender-male
          width="2.5rem"
          height="2.5rem"
          color="white"
        />
      </button>
      <button
        type="button"
        class="flex h-16 w-16 items-center justify-center rounded-full"
        :class="
          createCharacter.sex === Gender.FEMALE
            ? 'bg-pink-500 hover:bg-pink-600'
            : 'bg-gray-600 hover:bg-gray-700'
        "
        @click="createCharacter.sex = Gender.FEMALE"
      >
        <i-mdi-gender-female
          width="2.5rem"
          height="2.5rem"
          color="white"
        />
      </button>
    </div>
  </div>
</template>
