import alt from "alt-client";
import game from "natives";
import { ServerCall } from "@shared/calls/server";
import { Control, ControlType } from "@/constants/controls";
import { getPointNextToPointRelativeToPoint, getHeadingInDegrees } from "@/utility/math";
import { everyTickWhile } from "@/utility/event-helpers";
import { rpc } from "@/rpc";
import { LOS_FLAGS } from "../npc/constants/shapetest";
import { MaterialHash } from "./material-hash";

let inAction = false;
let unfreezeAt = 0;
let closest: [number, alt.VirtualEntity] | null = null;
let currentTree: alt.VirtualEntity;
const player = alt.Player.local;

const raycastTreeEdge = (
  playerPos: alt.Vector3,
  treePos: alt.IVector3,
  offset: number
): alt.Vector3 | null => {
  const flags = LOS_FLAGS.INCLUDE_ALL;
  const options = 0;

  const { x, y } = getPointNextToPointRelativeToPoint(player.pos, treePos, -1);

  const targetPos = new alt.Vector3({ x, y, z: treePos.z });

  // Calculate the direction from the player to the tree
  const direction = targetPos.sub(playerPos).normalize();

  // Find the perpendicular direction to create a vertical rectangle
  const perpendicular = new alt.Vector3(-direction.y, direction.x, 0).normalize();

  // Initialize variables to track the closest hit
  let closestHit: null | alt.Vector3 = null;
  let asd: any;
  let minDistance = Number.MAX_VALUE;

  // Loop to perform 5 raycasts
  for (let i = -2; i <= 2; i++) {
    const offsetVector = perpendicular.mul(offset * i);
    const startPos = playerPos.add(0, 0, 0.7).add(offsetVector);
    const endPos = targetPos.add(offsetVector);

    // Perform the raycast
    const hitTest = game.startExpensiveSynchronousShapeTestLosProbe(
      startPos.x,
      startPos.y,
      startPos.z,
      endPos.x,
      endPos.y,
      endPos.z,
      flags,
      player.scriptID,
      options
    );
    const [_didComplete, didHit, position, surfaceNormal, materialHash, _entityHit] =
      game.getShapeTestResultIncludingMaterial(hitTest);

    // If hit, calculate the distance and update the closest hit if necessary
    if (didHit && materialHash === MaterialHash.TreeBark) {
      const distance = playerPos.distanceTo(position);
      if (distance < minDistance) {
        minDistance = distance;
        closestHit = position;
        asd = {
          startPos,
          endPos,
          surfaceNormal,
        };
      }
    }
  }

  return closestHit;
};

// Function to handle the chopping action
const handleChoppingAction = async (ped: number) => {
  if (!closest) return;

  [, currentTree] = closest;
  const treeHitPos = raycastTreeEdge(player.pos, currentTree.pos, 0.2);

  if (!treeHitPos) {
    return;
  }

  const requiredHeading = getHeadingInDegrees(player.pos, treeHitPos) - 4;

  inAction = true;

  await alignToTree(ped, requiredHeading);

  const distance = player.pos.add(0, 0, 0.7).distanceTo(treeHitPos);

  if (distance > 1.3) {
    alt.log("too far", distance);
    inAction = false;
    return;
  }

  await performChopAnimation(ped);
};

let diff: number, angle: number, currentHeading: number;

// Function to align the player to the tree
const alignToTree = async (ped: number, requiredHeading: number) => {
  everyTickWhile(
    () => {
      currentHeading = game.getEntityHeading(ped);
      diff = Math.abs(requiredHeading - currentHeading);
      angle = Math.min(diff, 360 - diff);
      return angle > 10;
    },
    () => {
      if (currentHeading < requiredHeading) {
        game.setEntityHeading(ped, currentHeading + 5);
      } else {
        game.setEntityHeading(ped, currentHeading - 5);
      }
    }
  );
  await alt.Utils.waitFor(() => angle <= 10, 10000);
};

// Function to perform the chopping animation and effects
const performChopAnimation = async (ped: number) => {
  await loadAssets();

  game.freezeEntityPosition(ped, true);
  unfreezeAt = Date.now() + 1000;

  const delay = await rpc.callServer(ServerCall.FromClient.BEGIN_TREE_HIT, currentTree.remoteId);

  alt.Utils.wait(delay).then(() => {
    inAction = false;
  });

  await alt.Utils.wait(500);

  game.useParticleFxAsset("core");
  const { x, y, z } = player.pos.add(game.getEntityForwardVector(ped)).mul(1.0);

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
  const logs = await rpc.callServer(ServerCall.FromClient.TREE_HIT, currentTree.remoteId);

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
};

// Function to load necessary assets
const loadAssets = async () => {
  if (!game.hasNamedPtfxAssetLoaded("core")) {
    game.requestNamedPtfxAsset("core");
    await alt.Utils.waitFor(() => game.hasNamedPtfxAssetLoaded("core"));
  }
  if (!game.hasAnimDictLoaded("melee@hatchet@streamed_core")) {
    game.requestAnimDict("melee@hatchet@streamed_core");
    await alt.Utils.waitFor(() => game.hasAnimDictLoaded("melee@hatchet@streamed_core"));
  }
};

export function getNearbyTrees() {
  return alt.VirtualEntity.streamedIn.filter(
    (entity) => entity.getStreamSyncedMeta("entityType") === "tree"
  );
}

alt.setInterval(function updateClosestTree() {
  closest = getNearbyTrees().reduce<[number, alt.VirtualEntity] | null>((closest, tree) => {
    const distance = player.pos.distanceTo(tree.pos);
    if (distance > 5) return closest;
    return !closest || distance < closest[0] ? [distance, tree] : closest;
  }, null);
}, 300);

// Main tick logic
alt.everyTick(async () => {
  const ped = player.scriptID;

  const trees = getNearbyTrees();

  if (unfreezeAt && unfreezeAt < Date.now()) {
    game.freezeEntityPosition(ped, false);
    unfreezeAt = 0;
  }

  if (
    player.currentWeapon === 4191993645 &&
    trees.filter((tree) => player.pos.distanceTo(tree.pos) < 5).length > 0
  ) {
    game.disableControlAction(ControlType.PLAYER_CONTROL, Control.INPUT_ATTACK, true);

    if (
      !inAction &&
      game.isDisabledControlJustPressed(ControlType.PLAYER_CONTROL, Control.INPUT_ATTACK)
    ) {
      await handleChoppingAction(ped);
    }
  }
});
