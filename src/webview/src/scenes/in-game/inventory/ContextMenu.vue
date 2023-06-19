<script setup lang="ts">
import { computed } from "vue";
import Window from "@/components/Window.vue";
import { getItemName, isItemWeapon } from "@shared/modules/items";
import { InventoryItem } from "@shared/interfaces";

const props = defineProps<{
  item: InventoryItem;
  x: number;
  y: number;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "use", item: InventoryItem): void;
  (e: "equip", item: InventoryItem): void;
  (e: "drop", item: InventoryItem): void;
}>();

const isUsable = computed(() => false);
const isEquipable = computed(() => isItemWeapon(props.item.data.key));

function executeAction(action: () => void) {
  action();
  emit("close");
}
</script>

<template>
  <Window wrapper>
    <v-list :min-width="200" :style="{ translate: `${x}px ${y}px` }">
      <v-list-subheader>
        {{ getItemName(item.data.key) }}
      </v-list-subheader>
      <v-list-item
        v-if="isUsable"
        title="Use"
        prepend-icon="mdi-cursor-default-click-outline"
        value="use"
        @click="() => executeAction(() => emit('use', item))"
      />
      <v-list-item
        v-if="isEquipable"
        title="Equip"
        prepend-icon="mdi-sword-cross"
        value="equip"
        @click="() => executeAction(() => emit('equip', item))"
      />
      <v-list-item
        title="Drop"
        prepend-icon="mdi-drop"
        value="drop"
        @click="() => executeAction(() => emit('drop', item))"
      />
    </v-list>
  </Window>
</template>
