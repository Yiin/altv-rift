<script setup lang="ts">
const equipmentSlots = {
    mask: {
        x: 0, y: 0
    },
    glasses: {
        x: 0, y: 0
    },
    headwear: {
        x: 0, y: 0
    },
    earrings: {
        x: 0, y: 0
    },
    top: {
        x: 0, y: 0
    },
    shirt: {
        x: 0, y: 0
    },
    armor: {
        x: 0, y: 0
    },
    accessories1: {
        x: 0, y: 0
    },
    weapon: {
        x: 0, y: 0
    },
    ammo: {
        x: 0, y: 0
    },
    gloves: {
        x: 0, y: 0
    },
    watch: {
        x: 0, y: 0
    },
    pants: {
        x: 0, y: 0
    },
    accessories2: {
        x: 0, y: 0
    },
    backpack: {
        x: 0, y: 0
    },
    shoes: {
        x: 0, y: 0
    },
    phone: {
        x: 0, y: 0
    },
};

type EquipmentSlotName = keyof typeof equipmentSlots;

const props = defineProps<{
    name: EquipmentSlotName;
    item: InventoryItem;
}>();
</script>

<template>
    <div @mousedown.stop @touchstart.stop class="relative">
        <div class="absolute top-0 left-0 w-20 h-20 bg-gray-900/80 item-slot" :style="{
            transform: `translate(${x}px, ${y}px)`,
        }" />
        <ItemIcon :current-interaction="currentInteraction" :item="item" :selected="toRaw(selectedItem?.item) === item"
            @mousedown="handleMouseDown" @dblclick="useOrEquipItem(item)"
            @contextmenu.prevent="openActionMenu(item, $event)" />
    </div>
</div></template>