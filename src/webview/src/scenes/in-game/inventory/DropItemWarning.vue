<script setup lang="ts">
import { useItemDetails } from "@/composables/use-item-details";
import { getItemName, isItemFirearmWeapon } from "@shared/modules/items";
import { Dropping, useInventory } from "@/store/inventory.store";
import { computed } from "vue";

const props = defineProps<Dropping>();

const item = computed(() => props.item.item);

const inventory = useInventory();
const details = useItemDetails(item);
</script>

<template>
  <v-card
    ref="inventory.dropItemWarningRef"
    class="absolute mx-auto z-max"
    max-width="368"
    theme="light"
    :style="{
      left: `${position.x}px`,
      top: `${position.y}px`,
    }"
    v-click-outside="inventory.cancelDropping"
  >
    <v-card-item title="Drop item">
      <template v-slot:subtitle>
        <v-icon icon="mdi-alert" size="18" color="error" class="me-1 pb-1"></v-icon>

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
        v-if="isItemFirearmWeapon(item) && item.ammo"
        density="compact"
        prepend-icon="mdi-ammunition"
      >
        <v-list-item-subtitle class="flex items-end gap-1">
          <span class="font-bold">{{ getItemName(item.ammo.key) }}</span>
          <v-icon icon="mdi-close" size="12" />
          {{ item.ammo.clip }} / {{ item.ammo.rest }}
        </v-list-item-subtitle>
      </v-list-item>
    </div>

    <v-divider></v-divider>

    <v-card-actions class="justify-between">
      <v-btn @click="inventory.cancelDropping">Keep</v-btn>
      <v-btn color="error" @click="inventory.completeDropping">Destroy</v-btn>
    </v-card-actions>
  </v-card>
</template>
