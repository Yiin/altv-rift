<script setup lang="ts">
import { computed, ref } from "vue";
import { SlottedItem, useInventory } from "@/store/inventory.store";
import ItemIcon from "../ItemIcon.vue";
import { px } from "@/composables/use-pixel";
import { ItemType } from "@prisma/client";
import { AmmoItem, LocalEquipmentItemSource } from "@shared/interfaces";

const equipmentSlots = {
  headwear: {
    label: "Headwear",
    image: "./assets/inventory/headwear.png",
    x: px(0),
    y: px(0),
  },
  mask: {
    label: "Mask",
    image: "./assets/inventory/mask.png",
    x: px(90),
    y: px(0),
  },
  glasses: {
    label: "Glasses",
    image: "./assets/inventory/glasses.png",
    x: px(180),
    y: px(0),
  },
  backpack: {
    label: "Backpack",
    image: "./assets/inventory/backpack.png",
    x: px(0),
    y: px(90),
  },
  earrings: {
    label: "Earrings",
    image: "./assets/inventory/earrings.png",
    x: px(90),
    y: px(90),
  },
  neckwear: {
    label: "Neckwear",
    image: "./assets/inventory/bowtie.png",
    x: px(180),
    y: px(90),
  },
  top: {
    label: "Top",
    image: "./assets/inventory/top.png",
    x: px(0),
    y: px(180),
  },
  shirt: {
    label: "Shirt",
    image: "./assets/inventory/shirt.png",
    x: px(90),
    y: px(180),
  },
  armor: {
    label: "Armor",
    image: "./assets/inventory/armor.png",
    x: px(180),
    y: px(180),
  },
  gloves: {
    label: "Gloves",
    image: "./assets/inventory/gloves.png",
    x: px(0),
    y: px(270),
  },
  weapon: {
    label: "Weapon",
    image: "./assets/inventory/weapon.png",
    x: px(90),
    y: px(270),
  },
  ammo: {
    label: "Ammo",
    image: "./assets/inventory/ammo.png",
    x: px(180),
    y: px(270),
  },
  pants: {
    label: "Pants",
    image: "./assets/inventory/pants.png",
    x: px(0),
    y: px(360),
  },
  lefthand: {
    label: "Left hand",
    image: "./assets/inventory/watch.png",
    x: px(90),
    y: px(360),
  },
  righthand: {
    label: "Right hand",
    image: "./assets/inventory/bracelet.png",
    x: px(180),
    y: px(360),
  },
  shoes: {
    label: "Shoes",
    image: "./assets/inventory/shoes.png",
    x: px(0),
    y: px(450),
  },
  phone: {
    label: "Phone",
    image: "./assets/inventory/phone.png",
    x: px(90),
    y: px(450),
  },
};

type EquipmentSlotName = keyof typeof equipmentSlots;

const props = defineProps<{
  name: EquipmentSlotName;
}>();

const inventory = useInventory();

const item = computed(() => {
  if (props.name === "ammo") {
    const equipedAmmo = inventory.equipment.weapon?.item?.FIREARM_WEAPON?.ammo;

    if (equipedAmmo) {
      // Construct a fake slotted item that represents the ammo in the weapon
      return {
        item: {
          type: ItemType.AMMO,
          key: equipedAmmo.key,
          [ItemType.AMMO]: {
            amount: equipedAmmo.clip.amount + equipedAmmo.rest.amount,
          },
        },
        source: {
          type: "equipment",
          equipmentSlot: "ammo",
        },
      } as SlottedItem<LocalEquipmentItemSource, AmmoItem>;
    }
    return null;
  }
  return inventory.equipment[props.name] ?? null;
});
const slot = computed(() => equipmentSlots[props.name]);

function unequipItem() {
  inventory.unequipItem(props.name);
}

const nodeRef = ref<HTMLDivElement>();

defineExpose({
  node: nodeRef,
  equipmentSlot: props.name,
});
</script>

<template>
  <div
    ref="nodeRef"
    class="absolute top-0 left-0 w-20 h-20 bg-gray-800/80 item-slot text-white"
    :class="[item && 'drop-shadow-[2px_4px_6px_black]']"
    :style="{
      transform: `translate(${slot.x}px, ${slot.y}px)`,
    }"
  >
    <div
      v-if="!item"
      class="absolute w-full h-full bg-[center_35%] text-center pt-12 text-xs"
      :style="{
        backgroundImage: `url(${slot.image})`,
        backgroundSize: `30%`,
        filter: `contrast(0) opacity(0.9)`,
      }"
    >
      {{ slot.label }}
    </div>
  </div>
  <ItemIcon
    v-if="item"
    :item="item.item"
    :style="{ transform: `translate(${slot.x}px, ${slot.y}px)` }"
    @dblclick="unequipItem"
    @contextmenu.prevent="(e) => item && inventory.openContextMenu(item, e)"
  />
</template>
