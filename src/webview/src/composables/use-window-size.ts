import { reactive } from "vue";
import { useEventListener } from "./use-event-listener";

export const useWindowSize = () => {
  const size = reactive({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const onResize = () => {
    size.width = window.innerWidth;
    size.height = window.innerHeight;
  };

  useEventListener("resize", onResize);

  return size;
};
