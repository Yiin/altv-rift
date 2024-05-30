<script setup lang="ts">
import { type StorageItemSource } from "@shared/interfaces";
import { type Item } from "@shared/modules/items";
import { ServerCall } from "@shared/calls/server";
import { rpc } from "@/rpc";
import ItemIcon from "../inventory/ItemIcon.vue";

const props = defineProps<
  | {
      source: StorageItemSource;
      item: Item;
    }
  | {
      source?: undefined;
      item?: undefined;
    }
>();

function takeItem() {
  if (!props.item) {
    return;
  }
  return rpc.callServer(ServerCall.FromWebview.TAKE_ITEM, props.source);
}
</script>

<template>
  <div
    class="node-anchor relative h-21.25 w-21.25 border border-solid border-white/[0.03] bg-silverCloud/[0.01]"
  >
    <div
      ref="nodeRef"
      class="h-19 w-19 border-2 border-solid border-transparent"
    >
      <ItemIcon
        v-if="item"
        :item="item"
        @click="takeItem"
      />
    </div>
  </div>
</template>
