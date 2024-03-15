import { onMounted, onUnmounted, reactive, ref } from "vue";
import { type EventFromClient } from "@shared/events/webview/from-client";

export const useAlt = () => {
  const isMounted = ref(false);

  const onListeners = reactive<{ eventName: string; listener: (...args: any[]) => void }[]>([]);

  const on = <E extends keyof EventFromClient>(
    eventName: E | Exclude<string, E>,
    listener: EventFromClient[E],
  ) => {
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

  return { ...alt, on };
};
