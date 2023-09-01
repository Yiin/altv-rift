<script setup lang="ts">
import { useClient } from "@/store/synced/client.store";
import { useGameState } from "@/store/synced/game-state.store";
import { ClientFlags } from "@shared/store/client.store";
import { PlayerFlags } from "@shared/store/game-state.store";

const gameState = useGameState();
const client = useClient();
</script>

<template>
  <div>
    <div v-if="gameState.flags.has(PlayerFlags.InFishingArea)">In fishing area</div>
    <div v-if="client.flags.has(ClientFlags.CanFish)">Can fish!</div>
  </div>
</template>
