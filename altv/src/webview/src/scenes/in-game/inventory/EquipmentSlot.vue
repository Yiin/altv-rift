<script setup lang="ts">
import { computed, ref } from "vue";
import { type AmmoEquipmentSlot, EquipmentSlot, ItemSourceOrigin } from "@shared/interfaces";
import {
  InventoryInteractionType,
  isSameItemSource,
  getSlottedEquipment,
  unequipItem,
  registerItemSlot,
  openContextMenu,
  getCurrentInventoryInteraction,
} from "@/store/inventory";
import { px } from "@/composables/use-pixel";
import { useCombinableItem } from "@/composables/use-combinable-item";
import { useCharacter } from "@/store/synced/character.store";
import { asset } from "@/utils/asset";
import ItemIcon from "./ItemIcon.vue";

const equipmentSlots = {
  [EquipmentSlot.Headwear]: {
    label: "Headwear",
    image: asset("assets/inventory/headwear.webp"),
  },
  [EquipmentSlot.Mask]: {
    label: "Mask",
    image: asset("assets/inventory/mask.webp"),
  },
  [EquipmentSlot.Glasses]: {
    label: "Glasses",
    image: asset("assets/inventory/glasses.webp"),
  },
  [EquipmentSlot.Backpack]: {
    label: "Backpack",
    image: asset("assets/inventory/backpack.webp"),
  },
  [EquipmentSlot.Earrings]: {
    label: "Earrings",
    image: asset("assets/inventory/earrings.webp"),
  },
  [EquipmentSlot.Accessory]: {
    label: "Accessories",
    image: asset("assets/inventory/bowtie.webp"),
  },
  [EquipmentSlot.Top]: {
    label: "Top",
    image: asset("assets/inventory/top.webp"),
  },
  [EquipmentSlot.Armor]: {
    label: "Armor",
    image: asset("assets/inventory/armor.webp"),
  },
  [EquipmentSlot.Gloves]: {
    label: "Gloves",
    image: asset("assets/inventory/gloves.webp"),
  },
  [EquipmentSlot.Weapon]: {
    label: "Weapon",
    image: asset("assets/inventory/weapon.webp"),
  },
  [EquipmentSlot.Pants]: {
    label: "Pants",
    image: asset("assets/inventory/pants.webp"),
  },
  [EquipmentSlot.LeftHand]: {
    label: "Left hand",
    image: asset("assets/inventory/watch.webp"),
  },
  [EquipmentSlot.RightHand]: {
    label: "Right hand",
    image: asset("assets/inventory/bracelet.webp"),
  },
  [EquipmentSlot.Shoes]: {
    label: "Shoes",
    image: asset("assets/inventory/shoes.webp"),
  },
  [EquipmentSlot.Phone]: {
    label: "Phone",
    image: asset("assets/inventory/phone.webp"),
  },
  [EquipmentSlot.Tool]: {
    label: "Tool",
    image: asset("assets/inventory/tool.webp"),
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
  dontRegister?: boolean;
}>();

const character = useCharacter();

const slot = computed(() => equipmentSlots[props.name]);
const item = computed(() => getSlottedEquipment()[props.name] ?? null);

const { combinableWithHoveredItem, combinableWithOtherItems } = useCombinableItem(item);

const draggingStyle = computed(() => {
  if (!item.value) {
    return {};
  }
  const interaction = getCurrentInventoryInteraction();

  if (
    interaction.type === InventoryInteractionType.Dragging &&
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

const nodeRef = ref<HTMLDivElement>();

if (!props.dontRegister) {
  registerItemSlot({
    source: {
      origin: ItemSourceOrigin.PlayerEquipment,
      originId: character.id,
      equipmentSlot: props.name,
    },
    node: nodeRef,
  });
}
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
      :key="`empty-${name}`"
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
      :key="`item-${item.item.key}-${name}`"
      :item="item.item"
      :style="draggingStyle"
      @dblclick="() => unequipItem(name)"
      @contextmenu.prevent="(e) => item && openContextMenu(item, e)"
    />
  </div>
</template>
