import { ref, onMounted, nextTick, Ref, reactive } from 'vue';
import { useEventListener } from './use-event-listener';

export function useGapSize(elementRef: Ref<HTMLElement | undefined>) {
  const gapSize = ref(0);
  const widths = reactive<number[]>([]);

  const calculateGapSize = () => {
    nextTick(() => {
      if (!elementRef.value) return;

      const children = Array.from(elementRef.value.children);
      const totalChildrenWidth = children.reduce((total, child) => {
        widths.push(child instanceof HTMLElement ? child.clientWidth : 0);
        return total + (child instanceof HTMLElement ? child.offsetWidth : 0);
      }, 0);
      const containerWidth = elementRef.value.offsetWidth;
      const totalGapSpace = containerWidth - totalChildrenWidth;
      gapSize.value = totalGapSpace / (children.length * 2);
    });
  };

  onMounted(calculateGapSize);

  // Recalculate when the window resizes
  useEventListener('resize', calculateGapSize);

  return { gapSize, widths };
}
