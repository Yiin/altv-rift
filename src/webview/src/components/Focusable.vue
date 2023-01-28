<script setup lang="ts">
import { useFocus } from "../composables/use-focus";
import { effect, onUnmounted } from "vue";
import { isNodeFocusable } from "../utils/dom";

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const { isFocused, focusRef } = useFocus();

effect(() => {
  emit("update:modelValue", isFocused.value);
});

// Make parent elements non-focusable
// const observer = new MutationObserver((mutationList) => {
//   for (const mutation of mutationList) {
//     if (mutation.type === "childList") {
//       for (const node of Array.from(mutation.addedNodes)) {
//         if (isNodeFocusable(node)) {
//           node.setAttribute("tabindex", "-1");
//         }
//       }
//     } else if (mutation.type === "attributes") {
//       if (
//         mutation.attributeName === "tabindex" &&
//         isNodeFocusable(mutation.target)
//       ) {
//         mutation.target.setAttribute("tabindex", "-1");
//       }
//     }
//   }
// });

// effect(() => {
//   if (!focusRef.value) {
//     return;
//   }

//   focusRef.value.querySelectorAll("*").forEach((node) => {
//     if (isNodeFocusable(node)) {
//       node.setAttribute("tabindex", "-1");
//     }
//   });

//   observer.observe(focusRef.value, {
//     attributes: true,
//     childList: true,
//     subtree: true,
//   });
// });

// onUnmounted(() => {
//   observer.disconnect();
// });
</script>

<!-- <template>
  <div
    ref="focusRef"
    class="outline-0 p-2 -m-2"
    :style="{ backgroundColor: isFocused ? '#FFFFFF11' : '#FFFFFF00' }"
    tabindex="0"
    @pointerdown="focusRef?.focus"
  >
    <slot />
  </div>
</template> -->
<template>
  <div ref="focusRef" @pointerdown="focusRef?.focus">
    <slot />
  </div>
</template>
