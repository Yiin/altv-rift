import InventorySlot from "@/scenes/in-game/inventory/InventorySlot.vue";
import EquipmentSlot from "@/scenes/in-game/inventory/equipment/EquipmentSlot.vue";
import { useInventory } from "@/store/inventory.store";
import { onBeforeUpdate } from "vue";

export function useInventorySlots(type: "inventory" | "equipment") {
  const inventory = useInventory();

  onBeforeUpdate(() => {
    inventory.itemSlotRefs = inventory.itemSlotRefs.filter((ref) => ref.source.type !== type);
  });

  return {
    setSlotRef(
      ref: InstanceType<typeof InventorySlot> | InstanceType<typeof EquipmentSlot> | null
    ) {
      if (ref?.node) {
        inventory.itemSlotRefs.push({
          node: ref.node,
          source: (
            {
              inventory: {
                type: "inventory",
                inventorySlot: (ref as InstanceType<typeof InventorySlot>).slot,
              },
              equipment: {
                type: "equipment",
                equipmentSlot: (ref as InstanceType<typeof EquipmentSlot>).equipmentSlot,
              },
            } as const
          )[type],
        });
      }
    },
  };
}
