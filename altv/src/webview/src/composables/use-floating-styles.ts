import { computed, ref, watch, type UnwrapNestedRefs } from "vue";
import {
  flip,
  useFloating,
  type ReferenceElement,
  type UseFloatingOptions,
} from "@floating-ui/vue";

export function useFloatingStyles<T extends ReferenceElement = ReferenceElement>(
  position: UnwrapNestedRefs<{ x: number; y: number }>,
  options?: UseFloatingOptions<T>,
) {
  const floatingRef = ref();

  watch(position, () => update());

  const virtualEl = computed(
    () =>
      ({
        getBoundingClientRect() {
          return {
            width: 0,
            height: 0,
            x: position.x,
            y: position.y,
            left: position.x,
            right: position.x,
            top: position.y,
            bottom: position.y,
          };
        },
      }) as T,
  );

  const { floatingStyles, update } = useFloating(virtualEl, floatingRef, {
    placement: "bottom-start",
    middleware: [
      flip({
        padding: 24,
      }),
    ],
    ...options,
  });

  return {
    floatingRef,
    floatingStyles,
  };
}
