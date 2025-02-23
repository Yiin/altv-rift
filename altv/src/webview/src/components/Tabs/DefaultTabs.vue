<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

defineProps<{
  options: string[];
}>();

const modelValue = defineModel<number>({ default: 0 });
</script>

<template>
  <Tabs
    :default-value="options[0]"
    :value="options[modelValue]"
    class="w-full"
  >
    <TabsList class="flex w-full justify-around">
      <TabsTrigger
        v-for="tab in options"
        :key="tab"
        :value="tab"
        class="flex-shrink-0 flex-grow"
        @mousedown="modelValue = options.indexOf(tab)"
      >
        {{ tab }}
      </TabsTrigger>
    </TabsList>
  </Tabs>
</template>
