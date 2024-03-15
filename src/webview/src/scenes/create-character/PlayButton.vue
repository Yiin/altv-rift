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
    if (e.error.type === "ValidationError") {
      createCharacter.errors = e.error.errors;
    }
  }
  isLoading.value = false;
}
</script>

<template>
  <button
    class="mb-2 mr-2 flex items-center gap-4 rounded-lg bg-gradient-to-r from-red-800 via-red-600 to-red-700 bg-[length:400%_100%] px-5 py-2.5 text-center text-3xl font-medium uppercase tracking-wider text-white drop-shadow-md transition-all hover:bg-right"
    v-ripple
    @click="submit"
    :disabled="isLoading"
  >
    <v-icon
      size="3rem"
      icon="mdi-google-play"
    />
    Play
  </button>
</template>
