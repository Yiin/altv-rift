<script setup lang="ts">
import { computed, ref } from 'vue';
import { useInventoryGrid } from '@/composables/use-inventory-grid';
import { useInventory } from '@/store/inventory.store';
import ItemIcon from "./ItemIcon.vue";

const props = defineProps<{
    slot: number;
}>();

const inventoryGrid = useInventoryGrid();
const inventory = useInventory();

const nodeRef = ref<HTMLDivElement>();

const pos = computed(() => inventoryGrid.getSlotPositionInGrid(props.slot));
const item = computed(() => inventory.items.find(item => item.slot === props.slot));

function useOrEquipItem(...args: any[]) { }
function openActionMenu(...args: any[]) { }

defineExpose({
    node: nodeRef,
});
</script>

<template>
    <div ref="nodeRef" class="absolute top-0 left-0 w-20 h-20 bg-gray-800/80 item-slot text-white" :style="{
        transform: `translate(${pos.x}px, ${pos.y}px)`
    }" />
    <ItemIcon v-if="item" :item="item" @mousedown="inventory.handleMouseDown" @dblclick="useOrEquipItem(item)"
        @contextmenu.prevent="openActionMenu(item, $event)" />
</template>