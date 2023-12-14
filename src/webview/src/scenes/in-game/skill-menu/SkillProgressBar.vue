<script setup lang="ts">
import { getLevel, getLevelProgress, getMissingExperience } from '@shared/modules/experience/experience-table';
import { computed } from 'vue';

const props = defineProps<{
    xp: number;
    color: string;
}>();

const level = computed(() => getLevel(props.xp));
const progress = computed(() => getLevelProgress(props.xp));
</script>

<template>
    <div class="w-full flex flex-1 gap-1.5 items-center justify-center">

        <span class="inline-flex items-center justify-center rounded-full px-2.5 py-0.5">
            <p class="whitespace-nowrap text-sm font-bold text-white">
                {{ level }}
            </p>
        </span>
        <div class="flex flex-col items-center">
            <span role="progressbar" aria-labelledby="ProgressLabel" aria-valuenow="75"
                class="block rounded-full bg-neutral-200 dark:bg-neutral-700 w-full">
                <span class="block h-1 rounded-full" :class="[color]" :style="{ width: progress + '%' }"></span>
            </span>
            <span class="text-xs text-white">
                {{ xp }} / {{ xp + getMissingExperience(xp) }}
            </span>
        </div>
        <span class="inline-flex items-center justify-center rounded-full px-2.5 py-0.5">
            <p class="whitespace-nowrap text-sm font-bold text-white">
                {{ level + 1 }}
            </p>
        </span>
    </div>
</template>
