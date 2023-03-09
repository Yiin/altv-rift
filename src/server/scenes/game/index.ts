import alt from "alt-server";
import { bind } from "@shared/decorators";
import { on } from "@/decorators";

@bind()
export class GameScene {
  @on("playerDisconnect")
  async onPlayerDisconnect(player: alt.Player, reason: string) {
    alt.log(`Player ${player.name} disconnected. Reason: ${reason}`);

    await player.saveCharacter();
  }

  @on("playerDeath")
  async onPlayerDeath(
    player: alt.Player,
    killer: alt.Entity | null,
    reason: number
  ) {
    player.spawn(player.pos.x, player.pos.y, player.pos.z, 0);
  }
}
