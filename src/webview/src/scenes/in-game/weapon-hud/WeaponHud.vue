<script setup lang="ts">
import { useInventory } from "@/store/inventory.store";
import { ItemType } from "@prisma/client";
import { getItemData, getItemName, getItemInfoByKey } from "@shared/modules/items";
import { isItemFirearmWeapon } from "@shared/modules/items/weapons/firearms";
import { computed } from "vue";

const inventory = useInventory();

const weapon = computed(() => {
  const { weapon } = inventory.equipment;

  if (!weapon) {
    return null;
  }

  const weaponItem = weapon.item;

  if (!isItemFirearmWeapon(weaponItem)) {
    return null;
  }

  const name = getItemName(weaponItem.key);
  const weaponInfo = getItemInfoByKey(weaponItem.key);

  return {
    name,
    clipSize: weaponInfo.clipSize ?? 0,
    clip: getItemData(weaponItem).ammo?.clip.amount ?? 0,
    rest: getItemData(weaponItem).ammo?.rest.amount ?? 0,
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
