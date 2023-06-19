import alt from "alt-client";
import native from "natives";
import { WorldUIElementType } from "@shared/store/client.store";
import { clientStore } from "@/store/client.store";
import { npcSyncStore } from "@/store/npc-sync.store";

alt.everyTick(() => {
  drawNpcLabels();
});

function drawNpcLabels() {
  for (let i = 0; i < npcSyncStore.streamedIn.length; i++) {
    const entity = npcSyncStore.streamedIn[i];

    if (!(entity.id in clientStore.worldUIElements)) {
      // If the entity has a label and is not yet in our store, add it
      clientStore.addWorldUIElement({
        id: entity.id.toString(),
        type: WorldUIElementType.NpcLabel,
        pos: calculatePosition(entity.position),
        meta: entity.id,
      });
    }
  }

  // Now lets check if there are elements in the store that are not visible anymore
  for (const id in clientStore.worldUIElements) {
    if (!npcSyncStore.streamedIn.find((e) => e.id.toString() === id)) {
      // If the element in the store is not in the streamedEntities array, remove it from the store
      clientStore.removeWorldUIElement(id);
    }
  }

  // Finally update the positions of elements that are still visible
  for (const id in clientStore.worldUIElements) {
    const correspondingEntity = npcSyncStore.streamedIn.find(
      (e) => e.id.toString() === id
    );
    if (correspondingEntity) {
      clientStore.updateWorldUIElement({
        id,
        pos: calculatePosition(correspondingEntity.position),
      });
    }
  }
}

function calculatePosition(position: alt.Vector3) {
  const screenPos = alt.worldToScreen(position);

  // Calculate the scale of the label based on the distance to the player
  const distanceSquared = alt.Player.local.pos.distanceToSquared(position);
  const scale = Math.min(1, 100 / distanceSquared);

  const screenDimensions = alt.getScreenResolution();

  // Compute the position of the entity relative to the center of the screen
  const relativeX = screenPos.x - screenDimensions.x / 2;

  // Compute a skew factor based on how far the entity is from the center of the screen
  // This should be adjusted based on how much skew you want
  const skewFactorX = relativeX / (screenDimensions.x / 2);

  // Calculate the skew in degrees
  const skewX = -90 * skewFactorX;

  const camRot = native.getCamRot(0, 0);

  // Convert degrees to radians
  const yaw = camRot.z * (Math.PI / 180);
  const pitch = camRot.x * (Math.PI / 180);

  // Calculate the direction vector
  const cameraDirection = new alt.Vector3(
    Math.cos(yaw) * Math.cos(pitch),
    Math.sin(yaw) * Math.cos(pitch),
    Math.sin(pitch)
  );

  // Calculate the direction to the entity
  const directionToEntity = position.sub(alt.Player.local.pos).normalize();

  // Calculate the dot product of the two directions
  const dotProduct = cameraDirection.dot(directionToEntity);

  // Calculate the angle in degrees
  const angleInDegrees = Math.acos(dotProduct) * (180 / Math.PI);

  // Adjust the angle based on the screen resolution
  const skewZ = angleInDegrees * (screenDimensions.y / screenDimensions.x);

  return {
    x: screenPos.x,
    y: screenPos.y,
    scale,
    skewX,
    skewZ,
  };
}
