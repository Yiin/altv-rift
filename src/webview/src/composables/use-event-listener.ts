import { onUnmounted, onMounted } from "vue";

type Options = boolean | AddEventListenerOptions | undefined;

export const useEventListener = <K extends keyof WindowEventMap>(
  type: K,
  eventHandler: (event: WindowEventMap[K]) => void,
  options?: Options,
) => {
  // event handler
  const handler = (event: WindowEventMap[K]) => {
    eventHandler(event);
  };

  // add event listener
  onMounted(() => {
    window.addEventListener(type, handler, options);
  });

  // remove event listener on unmount
  onUnmounted(() => {
    window.removeEventListener(type, handler, options);
  });
};
