<script setup lang="ts">
import { useCreateCharacter } from "@/store/create-character.store";
import { ref } from "vue";

const createCharacter = useCreateCharacter();

const isLoading = ref(false);

async function submit() {
  isLoading.value = true;
  await createCharacter.submit()
  isLoading.value = false;
}
</script>

<template>
  <button
    class="text-white bg-gradient-to-r from-red-800 via-red-600 to-red-700 drop-shadow-md bg-[length:400%_100%] hover:bg-right transition-all font-medium rounded-lg text-3xl uppercase tracking-wider px-5 py-2.5 text-center mr-2 mb-2 flex items-center gap-4"
    v-ripple
    @click="submit"
    :disabled="isLoading"
  >
    <v-icon size="3rem" icon="mdi-google-play" />
    Play
  </button>
</template>
