<script setup lang="ts">
import { useEventListener } from "@/composables/use-event-listener";
import { clamp } from "lodash";
import { computed, ref } from "vue";

const props = defineProps<{
  options: { hex: string }[];
  modelValue: any;
  useIndexAsValue?: boolean;
  label?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
}>();

const isDragging = ref(false);

useEventListener("pointerup", () => {
  isDragging.value = false;
});

const selected = computed(() =>
  props.useIndexAsValue
    ? props.modelValue
    : props.options.indexOf(props.modelValue)
);
</script>

<template>
  <div>
    <div v-if="label" class="text-xs pb-2 uppercase tracking-wide">
      {{ label }}
    </div>
    <div class="flex flex-wrap" @pointerdown="isDragging = true">
      <div
        v-for="(color, index) in options"
        class="p-1 cursor-pointer"
        @pointerenter="
          isDragging &&
            emit('update:modelValue', useIndexAsValue ? index : color)
        "
        @pointerdown="
          emit('update:modelValue', useIndexAsValue ? index : color)
        "
      >
        <div
          :style="{ background: color.hex }"
          :class="[
            'w-6 h-6',
            selected === index || selected === color
              ? 'border-2 border-white'
              : 'border border-gray-500',
          ]"
        />
      </div>
    </div>
  </div>
</template>
