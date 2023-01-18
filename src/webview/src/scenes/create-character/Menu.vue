<script setup lang="ts">
import { computed } from "vue";
import XSelection from "../../components/XSelection.vue";
import XYSelection from "../../components/XYSelection.vue";
import { useCreateCharacter } from "../../store/create-character.store";
import CreateCharacter from "./CreateCharacter.vue";

const createCharacter = useCreateCharacter();

const menuItems = computed(() => [
  {
    to: "/create-character/parents",
    icon: "mdi-account-switch",
    title: "Parents",
  },
  {
    to: "/create-character/features",
    icon: "mdi-face-recognition",
    title: "Face Features",
  },
  {
    to: "/create-character/appearance",
    icon: createCharacter.sex
      ? "mdi-face-woman-shimmer"
      : "mdi-face-man-shimmer",
    title: "Appearance",
  },
  {
    to: "/create-character/hair-and-colors",
    icon: "mdi-palette",
    title: "Hair & Colors",
  },
]);
</script>

<template>
  <CreateCharacter title="New character creation">
    <v-card-item>
      <v-list :lines="false">
        <v-list-item class="pb-2">
          <v-text-field
            v-model="createCharacter.name"
            density="compact"
            variant="solo"
            label="Enter the name"
            prepend-icon="mdi-account-edit"
            single-line
            hide-details
          />
        </v-list-item>
        <v-list-item
          v-for="item of menuItems"
          :to="item.to"
          :prepend-icon="item.icon"
        >
          <v-list-item-title class="select-none">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-item>
  </CreateCharacter>
</template>
