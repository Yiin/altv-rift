import { InGamePlayer } from "@/core/utility/assertions";
import alt from "@altv/server";
import { Inventory, InventorySource, ItemSourceOrigin } from "@shared/interfaces";

export function findSourceByInventory(inventory: Inventory): InventorySource | null {
  const player = alt.Player.all.find(
    (player): player is InGamePlayer => player.character?.inventory === inventory,
  );

  if (player) {
    return {
      origin: ItemSourceOrigin.PlayerInventory,
      originId: player.character.id,
    };
  }

  return null;
}
