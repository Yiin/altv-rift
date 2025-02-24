import alt from "@altv/server";
import { useInventoryContext } from "@shared/modules/inventory/inventory.context";
import { findSourceByInventory } from "../items-manager/api/find-source-by-inventory";
import { ItemSourceOrigin, NotificationType } from "@shared/interfaces";
import { InGamePlayer } from "@/core/utility/assertions";

useInventoryContext().onInventoryFull((inventory) => {
  const source = findSourceByInventory(inventory);

  if (!source) {
    return;
  }

  if (source.origin === ItemSourceOrigin.PlayerInventory) {
    const player = alt.Player.all.find(
      (player): player is InGamePlayer => player.character?.id === source.originId,
    );

    if (!player) {
      return;
    }

    player.notify(NotificationType.Error, "You can't fit any more items in your inventory.", {
      title: "Inventory is full",
    });
  }
});
