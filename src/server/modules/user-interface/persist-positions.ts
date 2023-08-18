import { Interface } from "@prisma/client";
import { ServerCall } from "@shared/calls/server";
import { rpc } from "@/rpc";

rpc.registerWebview(ServerCall.FromWebview.MOVE_WINDOW, (player, name, screen) => {
    if (!player.store.isLoggedIn) {
        return;
    }

    const interfaces: (keyof Interface)[] = [
        'inventory',
        'questMenu',
        'skillsMenu',
    ];

    if (!player.store.user.interface) {
        player.store.user.interface = {} as Interface;
    }

    for (const name of interfaces) {
        if (name in player.store.user.interface === false) {
            player.store.user.interface[name] = null;
        }
    }

    if (name in player.store.user.interface === false) {
        return;
    }

    const interfaceName = name as keyof Interface;

    player.store.user.interface[interfaceName] = {
        ...player.store.user.interface[interfaceName],
        screen
    };
});