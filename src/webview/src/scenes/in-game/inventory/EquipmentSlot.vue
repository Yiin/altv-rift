<script setup lang="ts">
import { computed, ref } from "vue";
import { type AmmoEquipmentSlot, EquipmentSlot, ItemSourceOrigin } from "@shared/interfaces";
import { InteractionType, useInventory, isSameItemSource } from "@/store/inventory.store";
import { px } from "@/composables/use-pixel";
import { useCombinableItem } from "@/composables/use-combinable-item";
import ItemIcon from "./ItemIcon.vue";

const equipmentSlots = {
  [EquipmentSlot.Headwear]: {
    label: "Headwear",
    image: "./assets/inventory/headwear.png",
  },
  [EquipmentSlot.Mask]: {
    label: "Mask",
    image: "./assets/inventory/mask.png",
  },
  [EquipmentSlot.Glasses]: {
    label: "Glasses",
    image: "./assets/inventory/glasses.png",
  },
  [EquipmentSlot.Backpack]: {
    label: "Backpack",
    image: "./assets/inventory/backpack.png",
  },
  [EquipmentSlot.Earrings]: {
    label: "Earrings",
    image: "./assets/inventory/earrings.png",
  },
  [EquipmentSlot.Accessory]: {
    label: "Accessories",
    image: "./assets/inventory/bowtie.png",
  },
  [EquipmentSlot.Top]: {
    label: "Top",
    image: "./assets/inventory/top.png",
  },
  [EquipmentSlot.Armor]: {
    label: "Armor",
    image: "./assets/inventory/armor.png",
  },
  [EquipmentSlot.Gloves]: {
    label: "Gloves",
    image: "./assets/inventory/gloves.png",
  },
  [EquipmentSlot.Weapon]: {
    label: "Weapon",
    image: "./assets/inventory/weapon.png",
  },
  [EquipmentSlot.Pants]: {
    label: "Pants",
    image: "./assets/inventory/pants.png",
  },
  [EquipmentSlot.LeftHand]: {
    label: "Left hand",
    image: "./assets/inventory/watch.png",
  },
  [EquipmentSlot.RightHand]: {
    label: "Right hand",
    image: "./assets/inventory/bracelet.png",
  },
  [EquipmentSlot.Shoes]: {
    label: "Shoes",
    image: "./assets/inventory/shoes.png",
  },
  [EquipmentSlot.Phone]: {
    label: "Phone",
    image: "./assets/inventory/phone.png",
  },
  [EquipmentSlot.Tool]: {
    label: "Tool",
    image: "./assets/inventory/tool.png",
  },
  [EquipmentSlot.QuickSlot1]: {
    label: "Num 1",
  },
  [EquipmentSlot.QuickSlot2]: {
    label: "Num 2",
  },
  [EquipmentSlot.QuickSlot3]: {
    label: "Num 3",
  },
  [EquipmentSlot.QuickSlot4]: {
    label: "Num 4",
  },
} satisfies Record<Exclude<EquipmentSlot, AmmoEquipmentSlot>, { label: string; image?: string }>;

const props = defineProps<{
  name: Exclude<EquipmentSlot, AmmoEquipmentSlot>;
}>();

const inventory = useInventory();

const slot = computed(() => equipmentSlots[props.name]);
const item = computed(() => inventory.equipment[props.name] ?? null);

const { combinableWithHoveredItem, combinableWithOtherItems } = useCombinableItem(item);

const draggingStyle = computed(() => {
  if (!item.value) {
    return {};
  }
  const interaction = inventory.currentInteraction;

  if (
    interaction.type === InteractionType.Dragging &&
    !interaction.maybe &&
    isSameItemSource(interaction.state.item.source, item.value.source)
  ) {
    const x = interaction.state.currentPosition.x - interaction.state.startPosition.x;
    const y = interaction.state.currentPosition.y - interaction.state.startPosition.y;

    // We're currently dragging this item
    return {
      transform: `translate(${x + px(4)}px, ${y + px(4)}px)`,
      zIndex: Number.MAX_SAFE_INTEGER,
    };
  } else {
    // Item is chilling in its slot
    return {
      zIndex: 10,
    };
  }
});

function unequipItem() {
  inventory.unequipItem(props.name);
}

const nodeRef = ref<HTMLDivElement>();

inventory.registerItemSlot({
  source: {
    origin: ItemSourceOrigin.PlayerEquipment,
    originId: inventory.playerId,
    equipmentSlot: props.name,
  },
  node: nodeRef,
});
</script>

<template>
  <div
    ref="nodeRef"
    class="flex-basis-21 relative flex h-21.25 w-21.25 flex-col items-center justify-between border border-solid border-white/[0.03] bg-silverCloud/[0.01]"
    :class="{
      'bg-silverCloud/5': combinableWithHoveredItem || combinableWithOtherItems,
    }"
  >
    <div
      v-if="!item"
      class="h-full w-full bg-[center_35%] pt-14 text-center text-xs"
      :style="{
        backgroundImage: 'image' in slot ? `url(${slot.image})` : undefined,
        backgroundSize: `30%`,
        filter: `contrast(0) opacity(0.9)`,
      }"
    >
      {{ slot.label }}
    </div>
    <ItemIcon
      v-else
      :item="item.item"
      :style="draggingStyle"
      @mousedown="inventory.handleMouseDown"
      @dblclick="unequipItem"
      @contextmenu.prevent="(e) => item && inventory.openContextMenu(item, e)"
    />
  </div>
</template>
