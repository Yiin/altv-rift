import { ref } from "vue";

export const useFocus = () => {
  const isFocused = ref(false);
  const focusRef = ref<HTMLElement>();

  document.addEventListener(
    "focus",
    () => {
      isFocused.value = focusRef.value?.contains(document.activeElement) ?? false;

      // if (
      //   isFocused.value &&
      //   focusRef.value &&
      //   focusRef.value !== document.activeElement
      // ) {
      //   focusRef.value.focus();
      // }
    },
    true,
  );

  function focus() {
    if (focusRef.value) {
      focusRef.value.focus();
    }
  }

  return {
    isFocused,
    focus,
    focusRef,
  };
};
