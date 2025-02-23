<script setup lang="ts">
import { computed } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { wrap } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const props = defineProps<{
  options: any[];
  modelValue: any;
  valueText?: (value: any) => any;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
}>();

const current = computed(() => props.options.indexOf(props.modelValue));

const prev = () => {
  emit("update:modelValue", props.options[wrap(current.value - 1, props.options.length)]);
};

const next = () => {
  emit("update:modelValue", props.options[wrap(current.value + 1, props.options.length)]);
};
</script>

<template>
  <div class="flex items-center justify-center gap-2">
    <Button
      variant="outline"
      size="icon"
      class="h-8 w-8 shrink-0"
      @click="prev"
    >
      <ChevronLeft class="h-4 w-4" />
    </Button>
    <div class="flex min-w-20 flex-col items-center justify-center text-sm">
      <span
        v-for="(option, index) in options"
        :key="index"
        :class="['px-2', current !== index && 'invisible h-0']"
      >
        {{ props.valueText?.(option) ?? option }}
      </span>
    </div>
    <Button
      variant="outline"
      size="icon"
      class="h-8 w-8 shrink-0"
      @click="next"
    >
      <ChevronRight class="h-4 w-4" />
    </Button>
  </div>
</template>
