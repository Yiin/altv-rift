<script setup lang="ts">
import { ref } from "vue";
import Character from "./Character.vue";

enum Tab {
  CHARACTER = "CHARACTER",
  POSITIONS = "POSITIONS",
  IDEAS = "IDEAS",
}

const tabs = [
  { id: Tab.CHARACTER, label: "Character" },
  { id: Tab.POSITIONS, label: "Positions" },
  { id: Tab.IDEAS, label: "Ideas" },
];

const tab = ref<Tab>(Tab.CHARACTER);
</script>

<template>
  <div class="absolute-center bg-white px-8 py-5">
    <div class="mb-4 text-3xl text-black">Admin</div>

    <div class="border-b border-gray-200">
      <nav
        class="-mb-px flex gap-6"
        aria-label="Tabs"
      >
        <div
          v-for="{ id, label } in tabs"
          :key="id"
          @click="tab = id"
          class="shrink-0 cursor-pointer border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500"
          :class="
            tab === id
              ? 'border-sky-500'
              : 'border-transparent hover:border-gray-300 hover:text-gray-700'
          "
        >
          {{ label }}
        </div>
      </nav>
    </div>

    <div
      v-if="tab === Tab.CHARACTER"
      class="mt-4"
    >
      <Character />
    </div>
    <div
      v-if="tab === Tab.POSITIONS"
      class="mt-4"
    >
      <div class="text-lg text-gray-700">Positions</div>
    </div>
    <div
      v-if="tab === Tab.IDEAS"
      class="mt-4"
    >
      <div class="text-lg text-gray-700">Ideas</div>
    </div>
  </div>
</template>
