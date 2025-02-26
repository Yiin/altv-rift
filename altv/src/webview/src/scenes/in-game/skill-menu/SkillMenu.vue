<script setup lang="ts">
import { computed } from "vue";
import Window from "@/components/Window.vue";
import { useCharacter } from "@/store/synced/character.store";
import { px } from "@/composables/use-pixel";
import SkillProgressBar from "./SkillProgressBar.vue";

const character = useCharacter();

const skills = computed(() => [
  {
    name: "Woodcutting",
    xp: character.skills.woodcutting.exp,
    color: "bg-green-600",
  },
  {
    name: "Fishing",
    xp: character.skills.fishing.exp,
    color: "bg-blue-600",
  },
  {
    name: "Mining",
    xp: character.skills.mining.exp,
    color: "bg-neutral-300",
  },
  {
    name: "Crafting",
    xp: character.skills.crafting.exp,
    color: "bg-orange-600",
  },
  {
    name: "Medic",
    xp: character.skills.medic.exp,
    color: "bg-red-600",
  },
  {
    name: "Engineer",
    xp: character.skills.engineer.exp,
    color: "bg-purple-600",
  },
  {
    name: "Farmer",
    xp: character.skills.farmer.exp,
    color: "bg-yellow-600",
  },
  {
    name: "Food Delivery",
    xp: character.skills.foodDelivery.exp,
    color: "bg-green-600",
  },
  {
    name: "Cargo Carrier",
    xp: character.skills.cargoCarrier.exp,
    color: "bg-blue-600",
  },
  {
    name: "Firefighter",
    xp: character.skills.firefighter.exp,
    color: "bg-red-600",
  },
  {
    name: "Builder",
    xp: character.skills.builder.exp,
    color: "bg-orange-600",
  },
  {
    name: "Electrician",
    xp: character.skills.electrician.exp,
    color: "bg-purple-600",
  },
  {
    name: "Plumber",
    xp: character.skills.plumber.exp,
    color: "bg-blue-600",
  },
  {
    name: "Mechanic",
    xp: character.skills.mechanic.exp,
    color: "bg-orange-600",
  },
  {
    name: "Gardener",
    xp: character.skills.gardener.exp,
    color: "bg-green-600",
  },
  {
    name: "Mortician",
    xp: character.skills.mortician.exp,
    color: "bg-red-600",
  },
]);

const defaultPosition = computed(() => {
  return {
    x: window.innerWidth * 0.7,
    y: window.innerHeight * 0.1,
  };
});
</script>

<template>
  <Window
    :x="defaultPosition.x"
    :y="defaultPosition.y"
    :minw="px(400)"
    :is-active="false"
    :sticks="[]"
  >
    <div class="divide-y divide-neutral-800 rounded-xl border border-neutral-800 bg-neutral-900">
      <h3 class="m-4 text-lg font-bold text-white sm:text-xl">Skills</h3>

      <div
        v-for="skill in skills"
        :key="skill.name"
        class="px-6 py-3 [&_summary::-webkit-details-marker]:hidden"
      >
        <div class="flex cursor-pointer items-center justify-between gap-6 text-white">
          <h2 class="-mt-0.5 w-36 text-lg font-medium">
            {{ skill.name }}
          </h2>

          <SkillProgressBar
            :xp="skill.xp"
            :color="skill.color"
          />
        </div>
      </div>
    </div>
  </Window>
</template>
