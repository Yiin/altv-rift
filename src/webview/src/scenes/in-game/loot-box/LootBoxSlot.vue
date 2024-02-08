<script setup lang="ts">
import { Item } from "@shared/modules/items";
import { useLootBox } from "./loot-box";

const props = defineProps<{
  item?: Item;
}>();

const lootBox = useLootBox();

// const nodeRef = ref<HTMLDivElement>();

function takeItem() {
  if (!props.item) {
    return;
  }

}
</script>

<template>
  <div
    class="node-anchor h-21 w-21 border border-solid border-white/[0.03] bg-silverCloud/[0.01] relative">
    <div ref="nodeRef" class="h-19 w-19 border-2 border-solid border-transparent">
      <ItemIconVue v-if="item" :item="item" @click="takeItem" />
    </div>
  </div>
</template>
