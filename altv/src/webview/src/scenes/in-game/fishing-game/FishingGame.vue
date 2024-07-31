<script setup lang="ts">
import { FishingGameType } from "@shared/store/game-state.store";
import { useGameState } from "@/store/synced/game-state.store";
import TimeClickGame from "./TimeClickGame.vue";

const gameState = useGameState();
</script>

<template>
  <transition-group name="fade">
    <template v-if="gameState.fishingProgress">
      <TimeClickGame
        v-if="gameState.fishingProgress.gameType === FishingGameType.TimeClick"
        v-bind="gameState.fishingProgress"
      />
    </template>
  </transition-group>
</template>

<style>
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-leave-active {
  position: absolute;
}
</style>
