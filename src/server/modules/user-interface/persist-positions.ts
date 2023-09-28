import { Interface } from "@prisma/client";
import { ServerCall } from "@shared/calls/server";
import { rpc } from "@/core/rpc";
import { needsToBeLoggedIn } from "@/core/utility/assertions";

rpc.registerWebview(ServerCall.FromWebview.MOVE_WINDOW, (player, name, screen) => {
  needsToBeLoggedIn(player);

  const interfaces: (keyof Interface)[] = ["inventory", "questMenu", "skillsMenu"];

  if (!player.user.interface) {
    player.user.interface = {} as Interface;
  }

  for (const name of interfaces) {
    if (name in player.user.interface === false) {
      player.user.interface[name] = null;
    }
  }

  if (name in player.user.interface === false) {
    return;
  }

  const interfaceName = name as keyof Interface;

  player.user.interface[interfaceName] = {
    ...player.user.interface[interfaceName],
    screen,
  };
});
