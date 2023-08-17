import { ServerCall } from "@shared/calls/server";
import { rpc } from "@/rpc";

rpc.registerWebview(ServerCall.FromWebview.MOVE_WINDOW, (player, name, screen) => {
    if (!player.store.isLoggedIn) {
        return;
    }
    if (!player.store.user.interface) {
        player.store.user.interface = {
            inventory: null,
            questMenu: null,
            skillsMenu: null,
        };
    }
    if (name in player.store.user.interface === false) {
        return;
    }

    player.store.user.interface[name as keyof typeof player.store.user.interface] = {
        ...player.store.user.interface[name as keyof typeof player.store.user.interface],
        screen
    };
});