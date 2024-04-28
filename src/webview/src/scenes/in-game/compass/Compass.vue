<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { px } from "@/composables/use-pixel";

/**
 * direction is always [0, 360)
 */
const direction = ref(0);
const prevDirection = ref(direction.value);
const currentOffset = ref(23);

const translateX = ref(() => 0);

const LOWER_BOUND = 11; // >=180
const NORTH = 23; // 0
const UPPER_BOUND = 35; // <=180

// >=180 -> 0 = >=11 -> 23
// 0 -> 180 -> 23 -> 35

// offset for 0 = 23 * 40px
// offset for 180 = 11 * 40px || 35 * 40px
// offset for 270 = 47 * 40px = 47-11-1 = 17 * 40px
// bounds -> 11 to 35
// (offset 23) 0 to 270: offset within bounds, translateX to offset 41
// (offset 41) 270 to 15: offset out of bounds, reset offset to 17 and translateX to offset 24

/**
 * Always a final offset
 */
function getNormalizedOffsetForDirection(value: number) {
  value = value % 360;

  if (value === 0) {
    return NORTH;
  }
  // 11 -> 23
  if (value > 180) {
    return NORTH - (value - 180) / 15;
  }
  // 23 -> 35
  return NORTH + value / 15;
}

/**
 * Always a starting offset
 * Gets the offset where transition should start.
 * previousDirection is guaranteed to be within bounds
 *
 * This function calculates starting offset and accounts for wraps, meaning if
 * we start at 165 and need to go to 195, we need to go to the right,
 * and 195 to the right of 165 that's in the bounds is on offset 36.
 * Because of that, we need to reset startin offset to the left out of the bounds
 * to the offset 10, so going to the right to 195 we end up within bounds.
 */
function getStartingOffsetForDirection(previousDirection: number, nextDirection: number) {
  const difference = (nextDirection - previousDirection) / 15;

  if (previousDirection + difference < 11) {
    return 47;
  }
}

watch(direction, (newValue) => {
  const fromOffset = prevDirection.value / 15;

  translateX.value = translate;

  // Update previous direction after the transition is complete
  setTimeout(() => {
    prevDirection.value = newValue;

    // direction =
  }, 300); // This should match the transition time
});
</script>

<template>
  <div class="absolute-center-x top-3 w-60 overflow-hidden">
    <!-- <div class="relative flex w-61 gap-6"> -->
    <button
      type="button"
      @click="() => (direction += px(5))"
    >
      Change direction {{ direction }}
    </button>
    <div class="absolute-center-x h-3 w-0.5 bg-black"></div>
    <div
      class="compass-container"
      :class="{ 'compass-container--transition': direction !== prevDirection }"
      :style="{ transform: `translateX(${translateX}px)` }"
    >
      <div class="relative h-10">
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${0 * 40}px` }"
        >
          15
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${1 * 40}px` }"
        >
          30
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${2 * 40}px` }"
        >
          45
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${3 * 40}px` }"
        >
          60
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${4 * 40}px` }"
        >
          75
        </div>
        <!-- E -->
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${5 * 40}px` }"
        >
          90
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${6 * 40}px` }"
        >
          105
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${7 * 40}px` }"
        >
          120
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${8 * 40}px` }"
        >
          135
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${9 * 40}px` }"
        >
          150
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${10 * 40}px` }"
        >
          165
        </div>
        <!-- S -->
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${11 * 40}px` }"
        >
          180
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${12 * 40}px` }"
        >
          195
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${13 * 40}px` }"
        >
          210
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${14 * 40}px` }"
        >
          225
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${15 * 40}px` }"
        >
          240
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${16 * 40}px` }"
        >
          255
        </div>
        <!-- W -->
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${17 * 40}px` }"
        >
          270
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${18 * 40}px` }"
        >
          285
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${19 * 40}px` }"
        >
          300
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${20 * 40}px` }"
        >
          315
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${21 * 40}px` }"
        >
          330
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${22 * 40}px` }"
        >
          345
        </div>
        <!-- N -->
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${23 * 40}px` }"
        >
          0
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${24 * 40}px` }"
        >
          15
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${25 * 40}px` }"
        >
          30
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${26 * 40}px` }"
        >
          45
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${27 * 40}px` }"
        >
          60
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${28 * 40}px` }"
        >
          75
        </div>
        <!-- E -->
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${29 * 40}px` }"
        >
          90
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${30 * 40}px` }"
        >
          105
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${31 * 40}px` }"
        >
          120
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${32 * 40}px` }"
        >
          135
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${33 * 40}px` }"
        >
          150
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${34 * 40}px` }"
        >
          165
        </div>
        <!-- S -->
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${35 * 40}px` }"
        >
          180
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${36 * 40}px` }"
        >
          195
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${37 * 40}px` }"
        >
          210
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${38 * 40}px` }"
        >
          225
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${39 * 40}px` }"
        >
          240
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${40 * 40}px` }"
        >
          255
        </div>
        <!-- W -->
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${41 * 40}px` }"
        >
          270
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${42 * 40}px` }"
        >
          285
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${43 * 40}px` }"
        >
          300
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${44 * 40}px` }"
        >
          315
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${45 * 40}px` }"
        >
          330
        </div>
        <div
          class="absolute -translate-x-1/2"
          :style="{ left: `${46 * 40}px` }"
        >
          345
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.compass-container {
  display: flex;
  will-change: transform;
}

.compass-container--transition {
  transition: transform 0.3s ease-in-out;
}
</style>
