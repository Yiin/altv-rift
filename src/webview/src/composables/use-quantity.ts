import { ref, effect } from "vue";

export function useQuantity({ min = 1, max = 99 } = {}) {
  const quantity = ref<number>(1);

  function handleQuantityInput(e: Event) {
    const value = (e.target as HTMLInputElement).value;

    if (!value.length) {
      quantity.value = min;
      return;
    }

    const isNumber = /^\d*$/g.test(value);

    if (!isNumber) {
      e.preventDefault();
    } else {
      quantity.value = parseInt(value);
    }
  }

  effect(() => {
    quantity.value = Math.max(min, Math.min(max, quantity.value));
  });

  function handleQuantityKeydown(event: KeyboardEvent) {
    // Allow: Backspace, Delete, Tab, Escape, Enter, and Arrow keys
    if (
      ["Delete", "Backspace", "Tab", "Escape", "Enter", "ArrowLeft", "ArrowRight"].includes(
        event.key,
      ) ||
      // Allow: Ctrl/cmd+A
      (event.key === "a" && (event.ctrlKey === true || event.metaKey === true)) ||
      // Allow: Ctrl/cmd+C
      (event.key === "c" && (event.ctrlKey === true || event.metaKey === true)) ||
      // Allow: Ctrl/cmd+X
      (event.key === "x" && (event.ctrlKey === true || event.metaKey === true)) ||
      // Allow: Ctrl/cmd+V
      (event.key === "v" && (event.ctrlKey === true || event.metaKey === true)) ||
      // Allow: Home, End
      event.key === "Home" ||
      event.key === "End"
    ) {
      // Let it happen, don't do anything
      return;
    }

    if (["ArrowUp", "ArrowDown"].includes(event.key)) {
      event.preventDefault();
      quantity.value += event.key === "ArrowUp" ? 1 : -1;
      return;
    }

    // Ensure that it is a number and stop the keypress
    if (event.key < "0" || event.key > "9") {
      event.preventDefault();
    }
  }

  function handleQuantityPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData?.getData("text/plain");
    if (!clipboardData || !/^\d+$/.test(clipboardData)) {
      event.preventDefault();
    }
  }

  return {
    quantity,
    handleQuantityInput,
    handleQuantityKeydown,
    handleQuantityPaste,
  };
}
