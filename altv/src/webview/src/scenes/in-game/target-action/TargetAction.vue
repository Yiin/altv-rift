<script setup lang="ts">
import { ref } from "vue";
import { useClient } from "@/store/synced/client.store";
import Icon from "@/components/Icon/Icon.vue";

const client = useClient();

const active = ref(false);
</script>

<template>
  <div
    v-if="client.targetAction"
    :class="[
      'absolute flex flex-col items-center justify-center text-white',
      !client.targetAction.screenPos && 'h-full w-full',
    ]"
    :style="
      client.targetAction.screenPos
        ? {
            transform: `translate(${client.targetAction.screenPos.x}px, ${client.targetAction.screenPos.y}px)`,
          }
        : {}
    "
  >
    <Icon
      :name="client.targetAction.icon"
      v-bind="client.targetAction.iconProps"
    />
    <div
      @click="active = !!active"
      class="crisp-shadow -mt-2"
    >
      {{ client.targetAction.text }}
    </div>
  </div>
</template>
