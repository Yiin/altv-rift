<script setup lang="ts">
import { computed, ref } from "vue";
import { InteractionType, SlottedItem, useInventory, isSameItemSource } from "@/store/inventory.store";
import ItemIcon from "../ItemIcon.vue";
import { px } from "@/composables/use-pixel";

import { EquipmentSlot, ItemSourceOrigin, PlayerEquipmentItemSource } from "@shared/interfaces";
import { AmmoItem, isItemFirearmWeapon } from "@shared/modules/items";
import { useCombinableItem } from "@/composables/use-combinable-item";

const equipmentSlots = {
  headwear: {
    label: "Headwear",
    image: "./assets/inventory/headwear.png",
  },
  mask: {
    label: "Mask",
    image: "./assets/inventory/mask.png",
  },
  glasses: {
    label: "Glasses",
    image: "./assets/inventory/glasses.png",
  },
  backpack: {
    label: "Backpack",
    image: "./assets/inventory/backpack.png",
  },
  earrings: {
    label: "Earrings",
    image: "./assets/inventory/earrings.png",
  },
  accessory: {
    label: "Accessories",
    image: "./assets/inventory/bowtie.png",
  },
  top: {
    label: "Top",
    image: "./assets/inventory/top.png",
  },
  armor: {
    label: "Armor",
    image: "./assets/inventory/armor.png",
  },
  gloves: {
    label: "Gloves",
    image: "./assets/inventory/gloves.png",
  },
  weapon: {
    label: "Weapon",
    image: "./assets/inventory/weapon.png",
  },
  ammo: {
    label: "Ammo",
    image: "./assets/inventory/ammo.png",
  },
  pants: {
    label: "Pants",
    image: "./assets/inventory/pants.png",
  },
  lefthand: {
    label: "Left hand",
    image: "./assets/inventory/watch.png",
  },
  righthand: {
    label: "Right hand",
    image: "./assets/inventory/bracelet.png",
  },
  shoes: {
    label: "Shoes",
    image: "./assets/inventory/shoes.png",
  },
  phone: {
    label: "Phone",
    image: "./assets/inventory/phone.png",
  },
  tool: {
    label: "Tool",
    image: "./assets/inventory/tool.png",
  },
  quick1: {
    label: "Num 1",
  },
  quick2: {
    label: "Num 2",
  },
  quick3: {
    label: "Num 3",
  },
  quick4: {
    label: "Num 4",
  },
} satisfies Record<EquipmentSlot, { label: string; image?: string }>;

const props = defineProps<{
  name: EquipmentSlot;
}>();

const inventory = useInventory();

const slot = computed(() => equipmentSlots[props.name]);

const item = computed(() => {
  if (props.name === "ammo") {
    const weapon = inventory.equipment.weapon?.item;
    const equipedAmmo = weapon && isItemFirearmWeapon(weapon) && weapon?.ammo;

    if (equipedAmmo) {
      // Construct a fake slotted item that represents the ammo in the weapon
      return {
        item: {
          key: equipedAmmo.key,
          amount: equipedAmmo.clip + equipedAmmo.rest,
        },
        source: {
          origin: ItemSourceOrigin.PlayerEquipment,
          originId: inventory.playerId,
          equipmentSlot: "ammo",
        },
      } as SlottedItem<PlayerEquipmentItemSource, AmmoItem>;
    }
    return null;
  }
  return inventory.equipment[props.name] ?? null;
});

const { combinableWithHoveredItem, combinableWithOtherItems } = useCombinableItem(item);

const draggingStyle = computed(() => {
  if (!item.value) {
    return {};
  }
  const interaction = inventory.currentInteraction;

  if (
    interaction.type === InteractionType.Dragging &&
    isSameItemSource(interaction.state.item.source, item.value.source)
  ) {
    const x =
      interaction.state.currentPosition.x -
      interaction.state.startPosition.x;
    const y =
      interaction.state.currentPosition.y -
      interaction.state.startPosition.y;

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
    class="flex flex-col relative items-center h-21 w-21 justify-between bg-silverCloud/[0.01] border border-solid border-white/[0.03] flex-basis-21"
    :class="{
      'bg-silverCloud/5': combinableWithHoveredItem || combinableWithOtherItems
    }">
    <div v-if="!item" class="w-full h-full bg-[center_35%] text-center pt-14 text-xs" :style="{
      backgroundImage: 'image' in slot ? `url(${slot.image})` : undefined,
      backgroundSize: `30%`,
      filter: `contrast(0) opacity(0.9)`,
    }">
      {{ slot.label }}
    </div>
    <ItemIcon v-else="item" :item="item.item" :style="draggingStyle" @mousedown="inventory.handleMouseDown"
      @dblclick="unequipItem" @contextmenu.prevent="(e) => item && inventory.openContextMenu(item, e)" />
  </div>
</template>
