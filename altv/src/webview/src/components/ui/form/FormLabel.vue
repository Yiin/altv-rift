<script lang="ts" setup>
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useFormField } from "./useFormField";
import type { HTMLAttributes } from "vue";
import type { LabelProps } from "radix-vue";

const props = defineProps<LabelProps & { class?: HTMLAttributes["class"] }>();

const { error, formItemId } = useFormField();
</script>

<template>
  <Label
    :class="cn(error && 'text-destructive', props.class)"
    :for="formItemId"
  >
    <slot />
  </Label>
</template>
