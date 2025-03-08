<script setup lang="ts">
import { ref } from "vue";
import { useCreateCharacter } from "@/store/create-character.store";

const createCharacter = useCreateCharacter();

const isLoading = ref(false);

async function submit() {
  isLoading.value = true;
  try {
    await createCharacter.submit();
  } catch (e: any) {
    if (e.error?.type === "ValidationError") {
      createCharacter.errors = e.error.errors;
    }
  }
  isLoading.value = false;
}
</script>

<template>
  <button
    class="mb-2 mr-2 flex items-center gap-2 rounded-lg bg-linear-to-r from-red-800 via-red-600 to-red-700 bg-[length:400%_100%] px-5 py-2.5 text-center text-3xl font-bold uppercase tracking-wider text-white drop-shadow-md transition-all hover:bg-right"
    v-ripple
    @click="submit"
    :disabled="isLoading"
  >
    <i-material-symbols-light-motion-play-outline />
    Play
  </button>
</template>
