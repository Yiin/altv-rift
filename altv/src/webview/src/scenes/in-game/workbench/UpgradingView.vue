<script setup lang="ts">
import AvailableUpgrades from "./upgrading/AvailableUpgrades.vue";
import UpgradingProgress from "./upgrading/UpgradingProgress.vue";
import UpgradingDetails from "./upgrading/UpgradingDetails.vue";
</script>

<template>
  <div class="relative mt-17 flex grow justify-between gap-10 text-white">
    <AvailableUpgrades class="absolute left-0 top-0" />
    <UpgradingProgress
      class="align-self-center absolute left-1/2 top-2 max-w-190 -translate-x-1/2"
    />
    <UpgradingDetails class="self-right absolute right-0 top-11.5 h-full w-70" />
  </div>
</template>
