<script setup lang="ts">
import { useLootBox } from "./loot-box";
import ItemIcon from "../inventory/ItemIcon.vue";
import { StorageItemSource } from "@shared/interfaces";
import { Item } from "@shared/modules/items";
import { rpc } from "@/rpc";
import { ServerCall } from "@shared/calls/server";

const props = defineProps<{
  source: StorageItemSource;
  item: Item;
} | {
  source?: undefined;
  item?: undefined;
}>();

function takeItem() {
  if (!props.item) {
    return;
  }
  return rpc.callServer(ServerCall.FromWebview.TAKE_ITEM, props.source);
}
</script>

<template>
  <div
    class="node-anchor h-21 w-21 border border-solid border-white/[0.03] bg-silverCloud/[0.01] relative">
    <div ref="nodeRef" class="h-19 w-19 border-2 border-solid border-transparent">
      <ItemIcon v-if="item" :item="item" @click="takeItem" />
    </div>
  </div>
</template>
