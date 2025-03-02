import { ref, onMounted, onBeforeUnmount } from "vue";

/**
 * A composable that provides a self-correcting timer that accounts for drift
 * @param interval The interval in milliseconds (default: 1000ms = 1 second)
 * @returns An object containing the current time and a method to manually update the time
 */
export function useAccurateTimer(interval = 1000) {
  const now = ref(Date.now());
  let timeUpdateInterval: number | null = null;
  let lastUpdateTime = 0;

  // Function to manually update the time
  const updateTimeNow = () => {
    now.value = Date.now();
  };

  onMounted(() => {
    lastUpdateTime = Date.now();
    now.value = lastUpdateTime;

    const updateTime = () => {
      const currentTime = Date.now();
      now.value = currentTime;

      // Calculate the drift (how much we're off from the expected time)
      const elapsedTime = currentTime - lastUpdateTime;
      const delay = Math.max(0, interval - (elapsedTime % interval));

      // Set the next update with a corrected delay
      lastUpdateTime = currentTime;
      timeUpdateInterval = window.setTimeout(updateTime, delay);
    };

    updateTime();
  });

  onBeforeUnmount(() => {
    // Clean up the interval when component is destroyed
    if (timeUpdateInterval !== null) {
      clearTimeout(timeUpdateInterval);
      timeUpdateInterval = null;
    }
  });

  return {
    now,
    updateTimeNow,
  };
}
