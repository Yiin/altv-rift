<script setup lang="ts">
import { computed } from "vue";
import { useInventory } from "@/store/inventory.store";
import { getItemName, getItemInfoByKey, isItemFirearmWeapon } from "@shared/modules/items";

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
    clip: weaponItem.ammo?.clip ?? 0,
    rest: weaponItem.ammo?.rest ?? 0,
  };
});
</script>

<template>
  <div v-if="weapon" class="m-10 text-3xl text-white font-bold crisp-shadow">
    <div class="flex items-center">
      <span class="ml-2">{{ weapon.name }}</span>
    </div>
    <div class="flex items-center">
      <span>
        {{ weapon.clip }}
        <template v-if="weapon.clipSize">(max: {{ weapon.clipSize }}) / {{ weapon.rest }}</template>
      </span>
    </div>
  </div>
</template>
