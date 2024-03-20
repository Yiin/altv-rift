<script setup lang="ts">
import { computed } from "vue";
import { EquipmentSlot } from "@shared/interfaces";
import { getItemName } from "@shared/modules/items";
import { useInventory } from "@/store/inventory.store";
import { useCharacter } from "@/store/synced/character.store";
import { getItemImage } from "@/utils/items";

const inventory = useInventory();
const equipment = computed(() => useCharacter().equipment);
const equipedAmmo = computed(() =>
  ([
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
  ] as const)
    .filter(({ slot }) => equipment.value[slot])
    .map(({ slot, label }) => ({
      slot,
      label,
      key: equipment.value[slot]!.key,
      amount: equipment.value[slot]!.amount,
    })),
);
</script>

<template>
  <div class="z-max w-60">
    <div class="relative">
      <div
        v-if="equipedAmmo.length > 0"
        class="absolute -top-1.75 right-4"
      >
        <svg
          width="14"
          height="14"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            points="7,0 0,7 14,7"
            class="fill-white/5 backdrop-blur-[15px]"
          />
        </svg>
      </div>
      <div
        @mousedown.stop
        @mouseup.stop
        @click.stop
        class="relative max-h-135 overflow-auto rounded bg-white/5 backdrop-blur-[15px]"
      >
        <div
          v-for="({ slot, label, key, amount }, index) of equipedAmmo"
          :key="label"
          @click="() => inventory.unequipItem(slot)"
          class="flex items-center cursor-pointer gap-5 px-5.5 pb-2.5 pt-4 hover:bg-white/5"
          :class="{ 'border-t-1 border-dashed border-t-white/10': index > 0 }"
        >
          <div>
            <v-img
              :width="42"
              :height="30"
              :src="getItemImage(key)"
            />
          </div>
          <div class="flex flex-col gap-1">
            <div class="text-sm font-bold uppercase text-white">{{ getItemName(key) }}</div>
            <div class="text-sm font-semibold uppercase text-gray-500">{{ label }}</div>
          </div>
          <div class="flex flex-1 justify-end">
          <div class="text-white text-xs font-bold pt-1 pb-0.5 px-1.5 bg-zinc-300/10 rounded">
            {{ amount }}
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>
