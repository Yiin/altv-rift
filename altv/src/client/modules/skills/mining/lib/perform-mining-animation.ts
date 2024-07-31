import alt from "@altv/client";
import game from "@altv/natives";
import { ServerCall } from "@shared/calls/server";
import { rpc } from "@/core/rpc";
import { setIsMiningOre } from "./is-mining-ore";
import { getGroundPos } from "@/core/utility/get-ground-pos";

const player = alt.Player.local;

export async function performMiningAnimation(ore: alt.VirtualEntity) {
  await loadAssets();

  game.clearPedSecondaryTask(player);
  await alt.Utils.waitForNextTick();
  game.taskPlayAnim(player, "melee@large_wpn@streamed_core", "ground_attack_on_spot", 8, -8, -1, 0, 0, true, true, true);

  const cooldown = await rpc.callServer(ServerCall.FromClient.BEGIN_ORE_HIT, ore.remoteID);

  alt.Utils.wait(cooldown).then(() => {
    setIsMiningOre(false);
  });

  await alt.Utils.wait(1000);

  const { x, y, z } = await getGroundPos(ore.pos);

  game.useParticleFxAsset("core");
  game.startNetworkedParticleFxNonLoopedAtCoord("ent_dst_rocks", x, y, z, 0.0, 0.0, 0.0, 0.4, false, false, false, false);
  game.playSoundFromEntity(game.getSoundId(), "Drill_Pin_Break", player, "DLC_HEIST_FLEECA_SOUNDSET", true, 0);

  const ores = await rpc.callServer(ServerCall.FromClient.ORE_HIT, ore.remoteID);

  if (ores) {
    game.playSoundFromCoord(
      -1,
      "Object_Dropped_Remote",
      x,
      y,
      z,
      "GTAO_FM_Events_Soundset",
      false,
      0,
      false,
    );
  } else {
    alt.log("Failed to mine any ores");
  }

  await alt.Utils.wait(1000);
}

// Function to load necessary assets
async function loadAssets() {
  if (!game.hasNamedPtfxAssetLoaded("core")) {
    game.requestNamedPtfxAsset("core");
    await alt.Utils.waitFor(() => game.hasNamedPtfxAssetLoaded("core"));
  }

  if (!game.hasAnimDictLoaded("melee@large_wpn@streamed_core")) {
    game.requestAnimDict("melee@large_wpn@streamed_core");
    await alt.Utils.waitFor(() => game.hasAnimDictLoaded("melee@large_wpn@streamed_core"));
  }
  if (!game.hasAnimDictLoaded("rcmnigel1d")) {
    game.requestAnimDict("rcmnigel1d");
    await alt.Utils.waitFor(() => game.hasAnimDictLoaded("rcmnigel1d"));
  }

  loadDrillSound();
}

let drillSoundsLoaded = false;
let unloadTimeout: alt.Timers.Timeout | null = null;

function loadDrillSound() {
  if (drillSoundsLoaded) {
    return;
  }
  drillSoundsLoaded = true;

  game.requestAmbientAudioBank("DLC_HEIST_FLEECA_SOUNDSET", false, -1);
  game.requestAmbientAudioBank("DLC_MPHEIST\\HEIST_FLEECA_DRILL", false, -1);
  game.requestAmbientAudioBank("DLC_MPHEIST\\HEIST_FLEECA_DRILL_2", false, -1);

  if (unloadTimeout) {
    unloadTimeout.destroy();
  }
  unloadTimeout = setTimeout(unloadDrillSound, 10000);
}

function unloadDrillSound() {
  if (!drillSoundsLoaded) {
    return;
  }
  drillSoundsLoaded = false;

  game.releaseNamedScriptAudioBank("DLC_HEIST_FLEECA_SOUNDSET");
  game.releaseNamedScriptAudioBank("DLC_MPHEIST\\HEIST_FLEECA_DRILL");
  game.releaseNamedScriptAudioBank("DLC_MPHEIST\\HEIST_FLEECA_DRILL_2");
}