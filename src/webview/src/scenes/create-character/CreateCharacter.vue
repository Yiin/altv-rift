<script setup lang="ts">
import { useRoute } from "vue-router";
import { useCreateCharacter } from "../../store/create-character.store";

const props = defineProps<{ title: string; contentClass?: string }>();

const route = useRoute();
const createCharacter = useCreateCharacter();
</script>

<template>
  <v-card class="mx-auto mt-screen-1/10 select-none" max-width="344" flat>
    <v-card-item>
      <div class="text-overline mb-1">{{ props.title }}</div>
    </v-card-item>
    <v-tabs
      v-model="createCharacter.sex"
      class="mb-5"
      fixed-tabs
      bg-color="#444444"
    >
      <v-tab :value="0">
        <v-icon
          :color="!createCharacter.sex ? 'light-blue' : 'white'"
          size="x-large"
        >
          mdi-gender-male
        </v-icon>
      </v-tab>
      <v-tab :value="1">
        <v-icon
          :color="createCharacter.sex ? 'pink-lighten-1' : 'white'"
          size="x-large"
        >
          mdi-gender-female
        </v-icon>
      </v-tab>
    </v-tabs>

    <div :class="['create-character-card', props.contentClass]">
      <slot />
    </div>

    <v-divider />

    <v-card-item>
      <slot name="actions" />

      <v-list :lines="false" density="comfortable" nav>
        <v-list-item
          v-if="route.name !== 'CreateCharacter'"
          to="/create-character"
        >
          <template v-slot:prepend>
            <v-icon icon="mdi-chevron-left" />
          </template>

          <v-list-item-title class="select-none">
            Back to menu
          </v-list-item-title>
        </v-list-item>
        <v-list-item to="#" color="secondary">
          <template v-slot:prepend>
            <v-icon icon="mdi-account-check" />
          </template>

          <v-list-item-title class="select-none">
            Create character
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-item>
  </v-card>
</template>

<style>
.create-character-card {
  max-height: 60vh;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
