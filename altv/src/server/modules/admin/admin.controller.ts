import { diff, applyChangeset } from "json-diff-ts";
import { ServerCall } from "@shared/calls/server";
import { MessageType } from "@shared/modules/chat";
import { rpc } from "@/core/rpc";
import { needsToBeInGame } from "@/core/utility/assertions";
import { prisma } from "@/core/database";
import { sendChatMessage } from "../chat";
import { setupShop } from "../shops";
import { Shop } from "@shared/interfaces";

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
        sendChatMessage(player, "AirDrop added!", MessageType.Info);
        return true;
      } catch (err) {
        console.log(err);
        sendChatMessage(player, "Failed to add AirDrop!", MessageType.Error);
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
        console.log(err);
        sendChatMessage(player, "Failed to create shop!", MessageType.Error);
        return false;
      }
    }
  }
  return;
});
