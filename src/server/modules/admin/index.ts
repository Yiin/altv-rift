import { diff, applyChangeset } from "json-diff-ts";
import { ServerCall } from "@shared/calls/server";
import { rpc } from "@/core/rpc";
import { needsToBeInGame } from "@/core/utility/assertions";

rpc.registerWebview(ServerCall.FromWebview.ADMIN_ACTION, async (player, action, args) => {
  needsToBeInGame(player);

  switch (action) {
    case "character":
      const diffs = diff(
        player.character.$state,
        typeof args === "string" ? JSON.parse(args) : args,
      );

      applyChangeset(player.character, diffs);
      return;
  }
});
