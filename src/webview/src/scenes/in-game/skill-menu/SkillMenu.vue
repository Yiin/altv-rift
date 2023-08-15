<script setup lang="ts">
import Window from "@/components/Window.vue";
import SkillProgressBar from "./SkillProgressBar.vue";

const skills = [
    {
        name: "Woodcutting",
        xp: 78658,
        color: "bg-green-600",
    },
    {
        name: "Fishing",
        xp: 8275987,
        color: "bg-blue-600",
    },
    {
        name: "Mining",
        xp: 5226460,
        color: "bg-gray-300",
    },
    {
        name: "Crafting",
        xp: 56530,
        color: "bg-orange-600",
    },
]
</script>

<template>
    <Window :minw="400" :is-active="false" :sticks="[]">
        <div class="divide-y rounded-xl border divide-gray-800 border-gray-800 bg-gray-900">

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