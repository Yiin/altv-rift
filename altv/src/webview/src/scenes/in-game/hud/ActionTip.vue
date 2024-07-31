<script setup lang="ts">
import { computed } from "vue";
import { ActionTipType } from "@shared/store/client.store";
import { useClient } from "@/store/synced/client.store";
import { asset } from "@/lib/utils";

const client = useClient();

const tip = computed(() => {
  return client.actionTip;
});
</script>

<template>
  <div
    v-if="tip"
    class="drop-shadow-md"
  >
    <div
      v-if="tip.type === ActionTipType.MINING"
      class="flex items-center gap-3.25"
    >
      <img
        :src="asset('assets/action-tip-icons/mining.svg')"
        class="h-12 w-12"
      />
      <div>
        <div class="text-lg font-bold uppercase text-white">Mining</div>
        <div class="text-sm font-bold uppercase text-zinc-400">
          Press
          <span class="text-white">LMB</span>
          to start mining
        </div>
      </div>
    </div>
    <div
      v-else-if="tip.type === ActionTipType.WOODCUTTING"
      class="flex items-center gap-3.25"
    >
      <img
        :src="asset('assets/action-tip-icons/woodcutting.svg')"
        class="h-12 w-12"
      />
      <div>
        <div class="text-lg font-bold uppercase text-white">Woodcutting</div>
        <div class="text-sm font-bold uppercase text-zinc-400">
          Press
          <span class="text-white">LMB</span>
          to start cutting tree
        </div>
      </div>
    </div>
    <div
      v-else-if="tip.type === ActionTipType.FISHING"
      class="flex items-center gap-3.25"
    >
      <img
        :src="asset('assets/action-tip-icons/fishing.svg')"
        class="h-12 w-12"
      />
      <div>
        <div class="text-lg font-bold uppercase text-white">Fishing</div>
        <div class="text-sm font-bold uppercase text-zinc-400">
          Press
          <span class="text-white">LMB</span>
          to start fishing
        </div>
      </div>
    </div>
    <div
      v-else-if="tip.type === ActionTipType.PLANT_SEED"
      class="flex items-center gap-3.25"
    >
      <img
        :src="asset('assets/action-tip-icons/seed-plant.svg')"
        class="h-12 w-12"
      />
      <div>
        <div class="text-lg font-bold uppercase text-white">Plant seed</div>
        <div class="text-sm font-bold uppercase text-zinc-400">
          Press
          <span class="text-white">E</span>
          to plant seed
        </div>
      </div>
    </div>
    <div
      v-else-if="tip.type === ActionTipType.HARVEST"
      class="flex items-center gap-3.25"
    >
      <img
        :src="asset('assets/action-tip-icons/harvest.svg')"
        class="h-12 w-12"
      />
      <div>
        <div class="text-lg font-bold uppercase text-white">Mining</div>
        <div class="text-sm font-bold uppercase text-zinc-400">
          Press
          <span class="text-white">E</span>
          to harvest plant
        </div>
      </div>
    </div>
  </div>
</template>
