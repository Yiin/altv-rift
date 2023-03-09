<script setup lang="ts">
import { useItemDetails } from "@/composables/use-item-details";
import { getItemName } from "@shared/data/items";
import { InventoryItem } from "@shared/interfaces";

const props = defineProps<{
  item: InventoryItem;
}>();

const emit = defineEmits<{
  (e: "drop"): void;
  (e: "keep"): void;
}>();

const details = useItemDetails(props.item.data);
</script>

<template>
  <v-card class="mx-auto" max-width="368" theme="light">
    <v-card-item title="Drop item">
      <template v-slot:subtitle>
        <v-icon
          icon="mdi-alert"
          size="18"
          color="error"
          class="me-1 pb-1"
        ></v-icon>

        The item will be destroyed
      </template>
    </v-card-item>

    <v-card-text class="py-0">
      <div class="flex items-center justify-center">
        <v-img
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
        />
      </div>
    </v-card-text>

    <div class="d-flex py-3 justify-space-between">
      <v-list-item density="compact" prepend-icon="mdi-rename-outline">
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
          <span class="font-bold">{{
            getItemName(details.equipedAmmo.key)
          }}</span>
          <v-icon icon="mdi-close" size="12" />{{ details.equipedAmmo.amount }}
        </v-list-item-subtitle>
      </v-list-item>
    </div>

    <v-divider></v-divider>

    <v-card-actions class="justify-between">
      <v-btn @click="emit('keep')"> Keep </v-btn>
      <v-btn color="error" @click="emit('drop')"> Destroy </v-btn>
    </v-card-actions>
  </v-card>
</template>
