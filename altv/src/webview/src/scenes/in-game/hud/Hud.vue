<script setup lang="ts">
import { computed } from "vue";
import { useCharacter } from "@/store/synced/character.store";
import Icon from "@/components/Icon/Icon.vue";
import WeaponHud from "./WeaponHud.vue";

const character = useCharacter();

const money = computed(() => new Intl.NumberFormat("lt-LT").format(character.money));
</script>

<template>
  <div class="absolute right-0 top-32 m-10">
    <!-- Money -->
    <div class="mb-8 flex items-center justify-end gap-2.25">
      <div class="text-2xl font-bold text-white">{{ money }}</div>
      <Icon
        name="money"
        class="text-white"
        :size="1.1875"
      />
    </div>
    <WeaponHud />
  </div>
</template>
