import { onUnmounted, Ref } from "vue";

type Options = boolean | AddEventListenerOptions | undefined;

export const useEventListener = <K extends keyof WindowEventMap>(
  type: K,
  inputHandler: (event: WindowEventMap[K]) => void,
  options?: Options
) => {
  // keydown event handler
  const handler = (event: WindowEventMap[K]) => {
    inputHandler(event);
  };

  // add event listener
  window.addEventListener(type, handler, options);

  // remove event listener on unmount
  onUnmounted(() => {
    window.removeEventListener(type, handler, options);
  });
};
