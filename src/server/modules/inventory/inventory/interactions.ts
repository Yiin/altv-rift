import alt from "alt-server";
import { ServerEvents } from "@shared/events/server";

alt.on(ServerEvents.FromServer.DROP_ITEM, (player, itemSource) => {
    if (itemSource.type !== "inventory") {
        return;
    }

    const index = player.store.character.inventory.items.findIndex((inventoryItem) => {
        return inventoryItem.slot === itemSource.inventorySlot;
    });

    player.store.character.inventory.items.splice(index, 1);
});
