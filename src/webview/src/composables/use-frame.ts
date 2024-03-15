import { effect, onMounted, onUnmounted, ref, type Ref } from "vue";

export const useFrame = (handler: FrameRequestCallback, options?: { isActive: Ref<boolean> }) => {
  const isActive = options?.isActive ?? { value: true };

  const isMounted = ref(false);

  onMounted(() => {
    isMounted.value = true;
  });

  onUnmounted(() => {
    isMounted.value = false;
  });

  effect(() => {
    if (isActive.value) {
      start();
    }
  });

  function start() {
    requestAnimationFrame(function handle(time) {
      if (isActive.value && isMounted.value) {
        handler(time);
        requestAnimationFrame(handle);
      }
    });
  }
};
