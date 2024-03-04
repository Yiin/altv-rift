<script setup lang="ts">
import { computed } from "vue";
import { useInventory } from "@/store/inventory.store";
import { getItemName, isItemFirearmWeapon, isItemMeleeWeapon, isItemThrowableWeapon, getWeaponAmmoEquipmentSlot, isWeaponWithClip } from "@shared/modules/items";
import { getItemImage } from "@/utils/items";
import { useCharacter } from "@/store/synced/character.store";

const inventory = useInventory();
const character = useCharacter();

const weaponItem = computed(() => {
  const { weapon } = inventory.equipment;

  if (!weapon) {
    return null;
  }

  return weapon.item;
});

const weapon = computed(() => {
  if (!weaponItem.value) {
    return null;
  }

  if (isItemFirearmWeapon(weaponItem.value)) {
    const name = getItemName(weaponItem.value.key);

    const ammoSlot = getWeaponAmmoEquipmentSlot(weaponItem.value.key);

    if (!ammoSlot) {
      return null;
    }

    const equippedAmmo = character.equipment[ammoSlot];
    const clipAmmo = weaponItem.value.clip;

    const hasClip = isWeaponWithClip(weaponItem.value.key);

    /**
     * Make ammo easier to deal with.
     * If weapon has clip, the ammo in weapon clip is the clip ammo
     * and ammo in reserves is the rest.
     * Otherwise, we treat ammo in reserves as the clip ammo (for e.g. machinegun).
     */
    return {
      type: "firearm",
      name,
      ammo: clipAmmo || equippedAmmo,
      hasClip,
      hasAmmoReserves: hasClip && equippedAmmo && equippedAmmo.amount > 0,
      clip: (hasClip ? weaponItem.value.clip?.amount : equippedAmmo?.amount) ?? 0,
      rest: (hasClip ? equippedAmmo?.amount : 0) ?? 0,
      item: weaponItem.value,
    };
  }

  if (isItemMeleeWeapon(weaponItem.value)) {
    const name = getItemName(weaponItem.value.key);
    return {
      type: "melee",
      name,
      item: weaponItem.value,
    };
  }

  if (isItemThrowableWeapon(weaponItem.value)) {
    const name = getItemName(weaponItem.value.key);
    return {
      type: "throwable",
      name,
      item: weaponItem.value,
      amount: weaponItem.value.amount,
    };
  }

  return null;
});
</script>

<template>
  <div v-if="weapon" class="absolute right-0 top-1/3 m-10 flex flex-col items-end gap-2">
    <v-img :height="57" :width="115" :src="getItemImage(weapon.item)" />
    <div class="font-bold text-2xl text-white">{{ weapon.name }}</div>
    <template v-if="weapon.type === 'firearm'">
      <div v-if="weapon.ammo" class="pt-1 px-2 text-black bg-yellow-500 uppercase rounded font-bold">
        {{ getItemName(weapon.ammo.key) }}
      </div>
      <div class="flex items-end gap-2">
        <span class="text-4xl text-white">{{ weapon.clip }}</span>
        <span v-if="weapon.hasClip" class="text-xl text-white/50">{{ weapon.rest }}</span>
      </div>
    </template>
    <template v-if="weapon.type === 'throwable'">
      <div class="flex items-end gap-2">
        <span class="text-4xl text-white">{{ weapon.amount }}</span>
      </div>
    </template>
  </div>
</template>
