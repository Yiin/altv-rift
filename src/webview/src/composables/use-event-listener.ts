import { onUnmounted, Ref } from "vue";

interface Options {
  isActive?: Ref<boolean>;
}

export const useEventListener = <K extends keyof WindowEventMap>(
  type: K,
  inputHandler: (event: WindowEventMap[K]) => void,
  options?: Options
) => {
  // keydown event handler
  const handler = (event: WindowEventMap[K]) => {
    if (options?.isActive?.value ?? true) {
      inputHandler(event);
    }
  };

  // add event listener
  window.addEventListener(type, handler);

  // remove event listener on unmount
  onUnmounted(() => {
    window.removeEventListener(type, handler);
  });
};
