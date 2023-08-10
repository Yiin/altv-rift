<script setup lang="ts">
import Window from "@/components/Window.vue";
import { getItemName, isItemEquipable, isItemUsable } from "@shared/modules/items";
import { InventoryItem } from "@shared/interfaces";
import { computed } from "vue";
import { usePixel } from "@/composables/use-pixel";

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

const px = usePixel();

const isUsable = computed(() => isItemUsable(props.item.data.key));
const isEquipable = computed(() => isItemEquipable(props.item.data.key));

function executeAction(action: () => void) {
  action();
  emit("close");
}
</script>

<template>
  <Window wrapper>
    <div class="min-w-49 text-white bg-[#0b0d14]" :style="{ translate: `${x}px ${y}px` }">
      <div class="font-bold py-4 px-6">
        {{ getItemName(item.data.key) }}
      </div>
      <div
        class="py-4 px-6 cursor-pointer flex items-center gap-2 hover:bg-slate-900"
        v-if="isUsable"
        @click="() => executeAction(() => emit('use', item))"
      >
        <v-icon icon="mdi-cursor-default-click-outline" />
        <div class="-mt-1">Use</div>
      </div>
      <div
        class="py-4 px-6 cursor-pointer flex items-center gap-2 hover:bg-slate-900"
        v-if="isEquipable"
        title="Equip"
        prepend-icon="mdi-sword-cross"
        @click="() => executeAction(() => emit('equip', item))"
      >
        <v-icon icon="mdi-sword-cross" />
        <div class="-mt-1">Equip</div>
      </div>
      <div
        class="py-4 px-6 cursor-pointer flex items-center gap-2 hover:bg-slate-900"
        @click="() => executeAction(() => emit('drop', item))"
      >
        <v-icon icon="mdi-drop" />
        <div class="-mt-1">Drop</div>
      </div>
    </div>
  </Window>
</template>
