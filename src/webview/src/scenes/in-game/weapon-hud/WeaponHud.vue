<script setup lang="ts">
import { useInventory } from "@/store/inventory.store";
import { ItemType } from "@prisma/client";
import { getItemData, getItemName, getItemInfoByKey } from "@shared/modules/items";
import { computed } from "vue";

const inventory = useInventory();

const weapon = computed(() => {
  const { weapon } = inventory.equipment;

  if (!weapon) {
    return null;
  }
  if (weapon.type !== ItemType.FIREARM_WEAPON) {
    return null;
  }

  const name = getItemName(weapon.key);
  const weaponInfo = getItemInfoByKey(weapon.key);

  return {
    name,
    clipSize: weaponInfo.clipSize ?? 0,
    clip: getItemData(weapon).ammo?.clip.amount ?? 0,
    rest: getItemData(weapon).ammo?.rest.amount ?? 0,
  };
});
</script>

<template>
  <div v-if="weapon" class="text-lg text-white">
    <div class="flex items-center">
      <span class="ml-2">{{ weapon.name }}</span>
    </div>
    <div class="flex items-center">
      <span>{{ weapon.clip }} (max: {{ weapon.clipSize }}) / {{ weapon.rest }}</span>
    </div>
  </div>
</template>
