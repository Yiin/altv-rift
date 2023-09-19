<script setup lang="ts">
import Window from "@/components/Window.vue";
import SkillProgressBar from "./SkillProgressBar.vue";
import { useCharacter } from "@/store/synced/character.store";

const character = useCharacter();

const skills = [
    {
        name: "Woodcutting",
        xp: character.skills.woodcutting,
        color: "bg-green-600",
    },
    {
        name: "Fishing",
        xp: character.skills.fishing,
        color: "bg-blue-600",
    },
    {
        name: "Mining",
        xp: 0,
        color: "bg-neutral-300",
    },
    {
        name: "Crafting",
        xp: 0,
        color: "bg-orange-600",
    },
]
</script>

<template>
    <Window :minw="400" :is-active="false" :sticks="[]">
        <div class="divide-y rounded-xl border divide-neutral-800 border-neutral-800 bg-neutral-900">

            <h3 class="text-lg font-bold text-white sm:text-xl m-4">
                Skills
            </h3>


            <div v-for="skill in skills" class="px-6 py-3 [&_summary::-webkit-details-marker]:hidden">
                <div class="flex cursor-pointer items-center justify-between gap-6 text-white">
                    <h2 class="text-lg font-medium -mt-0.5 w-36">
                        {{ skill.name }}
                    </h2>

                    <SkillProgressBar :xp="skill.xp" :color="skill.color" />
                </div>
            </div>
        </div>
    </Window>
</template>
