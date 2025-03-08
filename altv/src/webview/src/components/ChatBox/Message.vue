<script setup lang="ts">
import { MessageType } from "@/enums";
import { parseColoredText } from "@/lib/utils/parse-colored-text";
import InfoIcon from "./icons/InfoIcon.vue";
import SuccessIcon from "./icons/SuccessIcon.vue";
import WarningIcon from "./icons/WarningIcon.vue";
import ErrorIcon from "./icons/ErrorIcon.vue";

const props = defineProps<{
  type: MessageType;
  content: string;
}>();
</script>

<template>
  <div
    class="fade-in flex flex-row items-center gap-[8px] text-base text-white select-none"
    :class="{
      'py-0.5': props.type !== MessageType.Default && props.type !== MessageType.Empty,
      'px-[8px]': props.type !== MessageType.Empty,
      info: props.type === MessageType.Info,
      success: props.type === MessageType.Success,
      warning: props.type === MessageType.Warning,
      error: props.type === MessageType.Error,
    }"
  >
    <InfoIcon v-if="props.type === MessageType.Info" />
    <SuccessIcon v-else-if="props.type === MessageType.Success" />
    <WarningIcon v-else-if="props.type === MessageType.Warning" />
    <ErrorIcon v-else-if="props.type === MessageType.Error" />
    <component :is="parseColoredText(content || '')" />
  </div>
</template>

<style lang="scss">
@import "./Message.scss";
</style>
