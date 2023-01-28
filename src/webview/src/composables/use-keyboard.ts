import { reactive } from "vue";
import { useEventListener } from "./use-event-listener";

export const useKeyboard = () => {
  const keys = reactive(new Set<string>());

  function handleDown(event: KeyboardEvent) {
    keys.add(event.key);
  }
  function handleUp(event: KeyboardEvent) {
    keys.delete(event.key);
  }

  useEventListener("keydown", handleDown);
  useEventListener("keyup", handleUp);

  return keys;
};
