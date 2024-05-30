<script setup lang="ts">
import { computed, ref } from "vue";
import { useEventListener } from "@/composables/use-event-listener";

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
  props.useIndexAsValue ? props.modelValue : props.options.indexOf(props.modelValue),
);
</script>

<template>
  <div>
    <div
      v-if="label"
      class="pb-2 text-xs uppercase tracking-wide"
    >
      {{ label }}
    </div>
    <div
      class="flex flex-wrap"
      @pointerdown="isDragging = true"
    >
      <div
        v-for="(color, index) in options"
        :key="index"
        class="cursor-pointer p-1"
        @pointerenter="isDragging && emit('update:modelValue', useIndexAsValue ? index : color)"
        @pointerdown="emit('update:modelValue', useIndexAsValue ? index : color)"
      >
        <div
          :style="{ background: color.hex }"
          :class="[
            'h-6 w-6',
            selected === index || selected === color
              ? 'border-2 border-white'
              : 'border border-neutral-500',
          ]"
        />
      </div>
    </div>
  </div>
</template>
