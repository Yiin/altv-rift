import * as alt from "@altv/server";
import { Inventory } from "@shared/interfaces";

const interactionInventoryGroup = alt.VirtualEntityGroup.create({ maxEntitiesInStream: 20 });
const interactionInventories = new Map<number, alt.VirtualEntity>();

export function getInteractionInventory(id: number) {
  return interactionInventories.get(id);
}

export function createInteractionInventory(inventory: Inventory, pos: alt.IVector3) {
  const ve = alt.VirtualEntity.create({
    group: interactionInventoryGroup,
    pos,
    streamingDistance: 50,
    data: {}
  });

  interactionInventories.set(ve.id, ve);
}
