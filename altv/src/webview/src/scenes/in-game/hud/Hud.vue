<script setup lang="ts">
import { computed } from "vue";
import { Icon } from "@iconify/vue";
import { useCharacter } from "@/store/synced/character.store";
import WeaponHud from "./WeaponHud.vue";
import ActionTip from "./ActionTip.vue";

const character = useCharacter();

const money = computed(() => new Intl.NumberFormat("lt-LT").format(character.money));
</script>

<template>
  <div class="absolute right-0 top-32 m-10">
    <!-- Money -->
    <div class="mb-8 flex items-center justify-end gap-2.25">
      <div class="text-2xl font-bold text-white">{{ money }}</div>
      <Icon
        icon="local:money"
        class="h-4.75 w-4.75 text-white"
      />
    </div>
    <WeaponHud />
  </div>
  <div class="absolute-center-y left-0 m-10">
    <ActionTip />
  </div>
</template>
