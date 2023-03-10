import { onMounted, onUnmounted, reactive, ref } from "vue";

export const useAlt = () => {
  const isMounted = ref(false);

  const onListeners = reactive<
    { eventName: string; listener: (...args: any[]) => void }[]
  >([]);

  const on = (eventName: string, listener: (...args: any[]) => void) => {
    onListeners.push({ eventName, listener });
    if (isMounted.value) {
      alt.on(eventName, listener);
    }
  };

  onMounted(() => {
    for (const { eventName, listener } of onListeners) {
      alt.on(eventName, listener);
    }
  });

  onUnmounted(() => {
    for (const { eventName, listener } of onListeners) {
      alt.off(eventName, listener);
    }
  });

  return { on };
};
