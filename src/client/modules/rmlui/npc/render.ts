import alt from "alt-client";
import game from "natives";
import { Bones } from "@shared/enums/bones";
import { container, elements, registeredElements } from "./elements";

declare module "alt-client" {
  interface RmlElement {
    ped: alt.Ped;
    shown: boolean;
    key: string;
  }
}

alt.RmlElement.prototype.shown = false;

alt.everyTick(() => {
  // Create elements for all streamed in npcs
  alt.Ped.streamedIn.forEach(createElement);

  // Now check if there are elements in the store that are not visible anymore
  elements.forEach(removeOrphanedElement);

  // Update the positions of elements that are still visible
  elements.forEach(renderElement);
});

function createElement(ped: alt.Ped) {
  const elementsMap = elements.has(ped)
    ? elements.get(ped)!
    : new Map<string, alt.RmlElement>();

  for (const registeredElement of registeredElements) {
    if (elementsMap.has(registeredElement.key)) {
      continue;
    }

    const element = registeredElement.create(ped);

    if (!element) {
      return;
    }

    container.appendChild(element);
    elementsMap.set(registeredElement.key, element);
  }

  if (!elements.has(ped)) {
    elements.set(ped, elementsMap);
  }
}

function removeOrphanedElement(
  elementsMap: Map<string, alt.RmlElement>,
  ped: alt.Ped
) {
  if (!alt.Ped.streamedIn.includes(ped)) {
    elementsMap.forEach((element) => {
      container.removeChild(element);
      elements.delete(ped);
      element.destroy();
    });
  }
}

function renderElement(elementsMap: Map<string, alt.RmlElement>, ped: alt.Ped) {
  // Get their position
  const pedPos = game.getPedBoneCoords(ped.scriptID, Bones.SKEL_Head, 0, 0, 0);
  const camPos = alt.getCamPos();
  const camDistToPed = camPos.distanceTo(pedPos);

  // Check if they're on the screen and optionally if line of sight check is enabled if there's nothing between us
  if (
    !game.isSphereVisible(pedPos.x, pedPos.y, pedPos.z, 0.0099999998) ||
    !game.hasEntityClearLosToEntity(alt.Player.local, ped, 17)
  ) {
    elementsMap.forEach(markElementAsHidden);
    return;
  }

  for (const registeredElement of registeredElements) {
    const element = elementsMap.get(registeredElement.key);

    if (!element) {
      // should not be happening
      console.log(`${registeredElement.key} not found`);
      continue;
    }

    if (camDistToPed > registeredElement.renderDistance) {
      markElementAsHidden(element);
      continue;
    }
    markElementAsVisible(element);

    const scale = calculateNpcElementScale(camDistToPed);

    registeredElement.update(element, {
      pedPos,
      camPos,
      camDistToPed,
      scale,
    });
  }
}

function calculateNpcElementScale(camDistToPed: number) {
  const fov = game.getGameplayCamFov(); // Field of view of the camera in degrees
  const { x: screenX, y: screenY } = alt.getScreenResolution();
  const aspectRatio = screenX / screenY; // Aspect ratio of the screen
  const screenDiagonal = Math.sqrt(screenX ** 2 + screenY ** 2);
  const scale = screenDiagonal / 2600;
  let { x: pitch, y: roll, z: yaw } = game.getGameplayCamRot(0);

  // Convert the FOV to radians and calculate the scale factor
  const fovRad = fov * (Math.PI / 180);

  // Calculate the perspective projection factor (not rly but good enough)
  const perspectiveProjectionFactor = 2 * Math.tan(fovRad / 2);

  // Calculate the inverse distance factor
  const inverseDistanceFactor = 1 / (Math.min(camDistToPed, 15) + 0.00001);

  // Now the scaleFactor combines both the inverse distance and the perspective projection
  const scaleFactor = perspectiveProjectionFactor * inverseDistanceFactor * 3;

  // Get the center of the screen
  const centerX = screenX / 2;
  const centerY = screenY / 2;

  // Calculate the distance from the center of the screen to the entity
  const sx = screenX - centerX;
  const sy = screenY - centerY;
  const distToCenter = Math.sqrt(sx * sx + sy * sy);

  // Add a distortion factor to the scale factor
  // This is a simple linear distortion that increases with distance from the center
  const distortionFactor = 1 + distToCenter / Math.max(centerX, centerY);

  // Apply camera's orientation (assumed to be Euler angles) into account
  pitch = pitch % 360;
  yaw = yaw % 360;
  roll = roll % 360;

  if (pitch > 180) pitch -= 360;
  if (yaw > 180) yaw -= 360;
  if (roll > 180) roll -= 360;

  // Calculate the scale of of font size
  return Math.min(1, scaleFactor * aspectRatio * distortionFactor) * scale;
}

function markElementAsVisible(element: alt.RmlElement) {
  if (element.shown) {
    return;
  }

  element.removeClass("hide");
  element.shown = true;
}

function markElementAsHidden(element: alt.RmlElement) {
  if (!element.shown) {
    return;
  }

  element.addClass("hide");
  element.shown = false;
}
