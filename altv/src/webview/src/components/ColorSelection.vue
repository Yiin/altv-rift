<script setup lang="ts">
import { computed, ref } from "vue";
import { useEventListener } from "@/composables/use-event-listener";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

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
    <Label
      v-if="label"
      class="text-xs uppercase"
    >
      {{ label }}
    </Label>
    <div
      class="mt-2 flex flex-wrap gap-1"
      @pointerdown="isDragging = true"
    >
      <button
        v-for="(color, index) in options"
        :key="index"
        type="button"
        class="relative h-6 w-6 cursor-pointer rounded-sm ring-offset-background transition-all hover:scale-110 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        :class="
          selected === index || selected === color
            ? 'z-50 ring-2 ring-ring ring-offset-2'
            : 'ring-1 ring-border'
        "
        :style="{ background: color.hex }"
        @pointerenter="isDragging && emit('update:modelValue', useIndexAsValue ? index : color)"
        @pointerdown="emit('update:modelValue', useIndexAsValue ? index : color)"
      />
    </div>
  </div>
</template>
