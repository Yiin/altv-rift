<script setup lang="ts">
withDefaults(
  defineProps<{
    selected?: boolean;
    static?: boolean;
  }>(),
  {
    selected: false,
    static: false,
  },
);
</script>

<template>
  <div
    class="flex items-center justify-center"
    :class="[
      selected
        ? 'workbench-slot--selected cursor-pointer border-transparent'
        : [
            'rounded-md border border-solid border-neutral-400/10 bg-neutral-400/5',
            !static && 'cursor-pointer hover:border-neutral-400/30 hover:bg-neutral-400/[21%]',
          ],
    ]"
  >
    <slot />
  </div>
</template>

<style>
.workbench-slot--selected {
  background: url("../../../../../public/assets/workbench/slot-background.svg");
  background-size: contain;
}
</style>
