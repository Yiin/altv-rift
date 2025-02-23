<script setup lang="ts">
import { computed } from "vue";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import { Button } from "@/components/ui/button";

const props = defineProps<{
  options: any[];
  modelValue: any;
  useIndexAsValue?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
}>();

const selected = computed(() =>
  props.useIndexAsValue ? props.modelValue : props.options.indexOf(props.modelValue),
);

function prev() {
  const index = selected.value - 1 <= 0 ? props.options.length - 1 : selected.value - 1;
  emit("update:modelValue", props.useIndexAsValue ? index : props.options[index]);
}

function next() {
  const index = selected.value + 1 >= props.options.length ? 0 : selected.value + 1;
  emit("update:modelValue", props.useIndexAsValue ? index : props.options[index]);
}
</script>

<template>
  <div class="mb-2">
    <div class="flex items-center justify-center gap-4">
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
          :class="selected !== index && 'invisible h-0'"
        >
          {{ option }}
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
  </div>
</template>
