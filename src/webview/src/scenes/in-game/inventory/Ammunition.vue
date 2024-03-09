<script setup lang="ts">
import { useInventory } from '@/store/inventory.store';
import { useCharacter } from '@/store/synced/character.store';
import { getItemImage } from '@/utils/items';
import { EquipmentSlot } from '@shared/interfaces';
import { getItemName } from '@shared/modules/items';
import { computed } from 'vue';

const inventory = useInventory();
const equipment = computed(() => useCharacter().equipment);
const equipedAmmo = computed(() => [
  { slot: EquipmentSlot.AssaultRifleAmmo, label: "Assault rifle" },
  { slot: EquipmentSlot.HandgunAmmo, label: "Handgun" },
  { slot: EquipmentSlot.MachineGunAmmo, label: "Machine gun" },
  { slot: EquipmentSlot.ShotgunAmmo, label: "Shotgun" },
  { slot: EquipmentSlot.SniperRifleAmmo, label: "Sniper rifle" },
  { slot: EquipmentSlot.RocketLauncherAmmo, label: "Rocket launcher" },
  { slot: EquipmentSlot.FireworkAmmo, label: "Firework" },
  { slot: EquipmentSlot.GrenadeLauncherAmmo, label: "Grenade launcher" },
  { slot: EquipmentSlot.PlasmaRaysAmmo, label: "Plasma rays" },
  { slot: EquipmentSlot.FireExtinguisherAmmo, label: "Fire extinguisher" },
  { slot: EquipmentSlot.SmokeGranadesAmmo, label: "Smoke granades" },
]
  .filter(({ slot }) => equipment.value[slot])
  .map(({ slot, ...rest }) => ({
    slot,
    label: rest.label,
    key: equipment.value[slot]!.key,
  }))
);
</script>

<template>
  <div class="w-60 z-max">
    <div class="relative">
      <div v-if="equipedAmmo.length > 0" class="absolute right-4 -top-1.75">
        <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg">
          <polygon points="7,0 0,7 14,7" class="fill-white/5 backdrop-blur-[15px]" />
        </svg>
      </div>
      <div
        @mousedown.stop
        @mouseup.stop
        @click.stop
        class="relative bg-white/5 backdrop-blur-[15px] max-h-135 overflow-auto rounded">
        <template v-for="({ slot, label, key }, index) of equipedAmmo">
          <div @click="() => inventory.unequipItem(slot)"
            class="py-7 px-5.5 flex gap-5 cursor-pointer hover:bg-white/5"
            :class="{ 'border-t-1 border-dashed border-t-white/10': index > 0 }">
            <!-- 42x30 -->
            <div>
              <v-img :height="30" :width="42" :src="getItemImage({ key })" />
            </div>
            <div class="flex flex-col gap-1">
              <div class="text-white text-sm font-bold uppercase">{{ getItemName(key) }}</div>
              <div class="text-gray-500 text-sm font-semibold uppercase">{{ label }}</div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
