import { Player } from "alt-server";
import type { ClientOptions, WindowOptions } from "@shared/modules/chat";
import { container } from "@shared/dependency-injection";
import { MountService, WindowService } from "../services";

/**
 * Updates the specified option for the specified player.
 */
export function updateOption(
  player: Player,
  key: keyof (ClientOptions & WindowOptions),
  value: (ClientOptions & WindowOptions)[keyof (ClientOptions & WindowOptions)]
) {
  container
    .resolve(MountService)
    .waitForMount(
      player,
      container.resolve(WindowService).updateOption(player, key, value)
    );
}

/**
 * Updates the specified options for all players.
 */
export function updateOptionAll(
  key: keyof (ClientOptions & WindowOptions),
  value: (ClientOptions & WindowOptions)[keyof (ClientOptions & WindowOptions)]
) {
  Player.all.forEach((player) => updateOption(player, key, value));
}

/**
 * Updates the specified options for the specified player.
 */
export function updateOptions(
  player: Player,
  options: Partial<ClientOptions & WindowOptions>
) {
  container
    .resolve(MountService)
    .waitForMount(
      player,
      container.resolve(WindowService).updateOptions(player, options)
    );
}

/**
 * Updates the specified options for all players.
 */
export function updateOptionsAll(
  options: Partial<ClientOptions & WindowOptions>
) {
  Player.all.forEach((player) => updateOptions(player, options));
}
