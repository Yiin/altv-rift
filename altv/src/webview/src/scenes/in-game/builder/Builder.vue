<script setup lang="ts">
import WorldEventsView from "./WorldEvents/WorldEventsView.vue";
import ShopsView from "./Shops/ShopsView.vue";
import { useAlt } from "@/composables/use-alt";
import { WebviewEvents } from "@shared/events/webview";
import { useClient } from "@/store/synced/client.store";
import ShopForm from "./Shops/ShopForm.vue";

const screenRef = ref<HTMLDivElement>();

const alt = useAlt();

const client = useClient();

const builder = computed(() => client.builder);
</script>

<template>
  <div v-if="builder" ref="screenRef" class="flex h-full w-full flex-col items-end justify-end p-10" @contextmenu.prevent>
    <div class="mb-2">
      <!-- <WorldEventsView v-if="currentView === View.WorldEvents" /> -->
      <ShopForm v-if="builder.view === BuilderView.CreateShop" />
      <ShopForm v-if="builder.view === BuilderView.EditShop" :shop="builder.shop" />
      <ShopsList v-if="builder.view === BuilderView.ListShops" />
    </div>
  </div>
</template>
