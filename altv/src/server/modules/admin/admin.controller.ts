import { diff, applyChangeset } from "json-diff-ts";
import { ServerCall } from "@shared/calls/server";
import { rpc } from "@/core/rpc";
import { needsToBeInGame } from "@/core/utility/assertions";
import { prisma } from "@/core/database";
import { setupShop } from "../shops";
import { NotificationType, Shop } from "@shared/interfaces";

rpc.registerWebview(ServerCall.FromWebview.ADMIN_ACTION, async (player, action, args) => {
  needsToBeInGame(player);

  switch (action) {
    case "character": {
      const diffs = diff(
        player.character.$state,
        typeof args === "string" ? JSON.parse(args) : args,
      );

      applyChangeset(player.character, diffs);
      return true;
    }
    case "addAirDrop": {
      try {
        const data = typeof args === "string" ? JSON.parse(args) : args;
        await prisma.airDrop.create({
          data: {
            ...data,
            pos: player.pos,
          },
        });
        player.notify(NotificationType.Success, "AirDrop added!");
        return true;
      } catch (err) {
        console.log(err);
        player.notify(NotificationType.Error, "Failed to add AirDrop!");
        return false;
      }
    }
    case "createShop": {
      const data = typeof args === "string" ? JSON.parse(args) : args;

      try {
        const shop = await prisma.shop.create({
          data,
        });

        setupShop(shop as Shop);
      } catch (err) {
        player.notify(NotificationType.Error, "Failed to create shop!");
        return false;
      }
    }
  }
  return;
});
