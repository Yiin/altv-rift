<script setup lang="ts">
import { computed } from "vue";
import { ActionTipType } from "@shared/store/client.store";
import { PlayerFlags } from "@shared/store/game-state.store";
import { useClient } from "@/store/synced/client.store";
import { asset } from "@/lib/utils";
import Image from "@/components/Image.vue";
import { useGameState } from "@/store/synced/game-state.store";

const client = useClient();
const gameState = useGameState();

const tip = computed(() => {
  return client.actionTip;
});

const isFishing = computed(() => {
  return gameState.flags.has(PlayerFlags.IsFishing);
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
      <Image
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
      <Image
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
      <Image
        :src="asset('assets/action-tip-icons/fishing.svg')"
        class="h-12 w-12"
      />
      <div>
        <div class="text-lg font-bold uppercase text-white">Fishing</div>
        <div
          v-if="!isFishing"
          class="text-sm font-bold uppercase text-zinc-400"
        >
          Press
          <span class="text-white">ALT</span>
          to start fishing
        </div>
        <div
          v-else
          class="text-sm font-bold uppercase text-zinc-400"
        >
          Press
          <span class="text-white">Right Click or ALT</span>
          to stop fishing
        </div>
      </div>
    </div>
    <div
      v-else-if="tip.type === ActionTipType.PLANT_SEED"
      class="flex items-center gap-3.25"
    >
      <Image
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
      <Image
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
