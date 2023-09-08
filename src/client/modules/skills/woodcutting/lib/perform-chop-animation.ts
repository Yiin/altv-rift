import alt from "alt-client";
import game from "natives";
import { ServerCall } from "@shared/calls/server";
import { rpc } from "@/core/rpc";
import { setIsChoppingTree } from "./is-chopping-tree";

const player = alt.Player.local;

export async function performChopAnimation(tree: alt.VirtualEntity) {
  await loadAssets();

  const cooldown = await rpc.callServer(ServerCall.FromClient.BEGIN_TREE_HIT, tree.remoteId);

  alt.Utils.wait(cooldown).then(() => {
    setIsChoppingTree(false);
  });

  await alt.Utils.wait(500);

  game.useParticleFxAsset("core");

  const { x, y, z } = player.pos.add(game.getEntityForwardVector(player)).mul(1.0);

  const effect = game.startParticleFxLoopedAtCoord(
    "bul_wood_splinter",
    x,
    y,
    z,
    0.0, // rx
    0.0, // ry
    0.0, // rz
    2.0, // scale
    false,
    false,
    false,
    false
  );
  const logs = await rpc.callServer(ServerCall.FromClient.TREE_HIT, tree.remoteId);

  if (logs) {
    game.playSoundFromCoord(
      -1,
      "Object_Dropped_Remote",
      x,
      y,
      z,
      "GTAO_FM_Events_Soundset",
      false,
      0,
      false
    );
  }

  await alt.Utils.wait(1000);
  game.stopParticleFxLooped(effect, false);
}

// Function to load necessary assets
async function loadAssets() {
  if (!game.hasNamedPtfxAssetLoaded("core")) {
    game.requestNamedPtfxAsset("core");
    await alt.Utils.waitFor(() => game.hasNamedPtfxAssetLoaded("core"));
  }
  if (!game.hasAnimDictLoaded("melee@hatchet@streamed_core")) {
    game.requestAnimDict("melee@hatchet@streamed_core");
    await alt.Utils.waitFor(() => game.hasAnimDictLoaded("melee@hatchet@streamed_core"));
  }
}
