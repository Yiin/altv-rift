<script setup lang="ts">
import { useItemDetails } from "@/composables/use-item-details";
import { usePixel } from "@/composables/use-pixel";
import { getItemName } from "@shared/modules/items";
import { InventoryItem } from "@shared/interfaces";
import { computed, ref } from "vue";

const props = defineProps<{
  item: InventoryItem;
}>();

const px = usePixel();
const data = computed(() => props.item.data);
const noImage = ref(false);

const details = useItemDetails(data);
</script>

<template>
  <v-card
    class="mx-auto v-card--transparent"
    :max-width="px(300)"
    theme="light"
  >
    <v-card-item :title="details.customName ?? details.name">
      <template v-slot:subtitle>
        <span class="whitespace-normal">
          {{ details.description }}
        </span>
      </template>
    </v-card-item>

    <v-card-text class="py-0">
      <div class="flex items-center justify-center">
        <v-img
          v-if="!noImage"
          :transition="false"
          class="drop-shadow-md flex-grow-0 my-5"
          width="10rem"
          :src="details.image"
          :style="{
            filter:
              false &&
              `drop-shadow(1px 1px 0 var(--color-yellow-500))
                  drop-shadow(-1px -1px 0 var(--color-yellow-500))
                  drop-shadow(-1px 1px 0 var(--color-yellow-500))
                  drop-shadow(1px -1px 0 var(--color-yellow-500))`,
            transform: `scale(${details.imageScale})`,
          }"
          @error="noImage = true"
        />
        <div v-else class="text-sm tracking-wider font-bold">
          {{ details.name }}
        </div>
      </div>
    </v-card-text>

    <div class="d-flex py-3 justify-space-between">
      <v-list-item
        v-if="details.customName"
        density="compact"
        prepend-icon="mdi-rename-outline"
      >
        <v-list-item-subtitle class="font-bold">
          {{ details.name }}
        </v-list-item-subtitle>
      </v-list-item>

      <v-list-item
        v-if="details.equipedAmmo"
        density="compact"
        prepend-icon="mdi-ammunition"
      >
        <v-list-item-subtitle class="flex items-end gap-1">
          <span class="font-bold">
            {{ getItemName(details.equipedAmmo.key) }}
          </span>
          <v-icon icon="mdi-close" size="12" />{{ details.equipedAmmo.amount }}
        </v-list-item-subtitle>
      </v-list-item>
    </div>
  </v-card>
</template>
