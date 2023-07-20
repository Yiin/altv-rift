import alt from "alt-client";
import game from "natives";
import FixedReverseHeap from "mnemonist/fixed-reverse-heap";
import {
  container,
  document,
  elements,
  registeredElements,
  renderer,
} from "./elements";

declare module "alt-client" {
  interface RmlElement {
    entity: alt.Ped;
    shown: boolean;
    key: string;
  }

  interface Ped {
    frameData: {
      distance: number;
      zIndex: number;
      isVisible: boolean;
    };
  }
}

const MAX_RENDERED_ELEMENTS = 20;

const visibleElementsHeap = new FixedReverseHeap<alt.RmlElement>(
  Array,
  (a, b) => b.zIndex - a.zIndex,
  MAX_RENDERED_ELEMENTS
);

const notRenderedElements = new Set<alt.RmlElement>();

setInterval(() => {
  alt.log(`Elements: ${elements.size}`);
  alt.log(`Visible: ${visibleElementsHeap.size}`);
  alt.log(`Not rendered: ${notRenderedElements.size}`);
}, 5000);

alt.RmlElement.prototype.shown = false;

alt.everyTick(() => {
  visibleElementsHeap.clear();
  notRenderedElements.clear();

  // Create elements for all streamed in npcs
  alt.Ped.streamedIn.forEach(prepare);

  // Now check if there are elements in the store that are not visible anymore
  elements.forEach(removeOrphanedElement);

  // Update the positions of elements that are still visible
  (visibleElementsHeap.consume() as alt.RmlElement[]).forEach(renderElement);

  // Hide elements that are not shown because of the limit
  notRenderedElements.forEach(markElementAsHidden);
});

function prepare(ped: alt.Ped) {
  preparePedForTheFrame(ped);
  preparePedElements(ped);
}

function preparePedForTheFrame(ped: alt.Ped) {
  const camPos = alt.getCamPos();
  const camDistToPed = camPos.distanceTo(ped.pos);
  const zIndex = ~~(1000000 - camDistToPed * 10000);

  const isVisible =
    game.isSphereVisible(ped.pos.x, ped.pos.y, ped.pos.z, 0.01) &&
    game.hasEntityClearLosToEntity(alt.Player.local, ped, 17);

  if (!ped.frameData) {
    ped.frameData = {
      distance: camDistToPed,
      zIndex,
      isVisible,
    };
  } else {
    ped.frameData.distance = camDistToPed;
    ped.frameData.zIndex = zIndex;
    ped.frameData.isVisible = isVisible;
  }
}

function preparePedElements(ped: alt.Ped) {
  const elementsMap = elements.has(ped)
    ? elements.get(ped)!
    : new Map<string, alt.RmlElement>();

  for (const [key, registeredElement] of registeredElements) {
    if (!elementsMap.has(key)) {
      const node = document.createElement("div");

      node.addClass("hide");
      node.style["z-index"] = ped.frameData.zIndex.toString();
      node.key = key;
      node.entity = ped;

      container.appendChild(node);
      elementsMap.set(key, node);
    }
    const node = elementsMap.get(key)!;

    notRenderedElements.add(node);

    if (
      ped.frameData.isVisible &&
      ped.frameData.distance <= registeredElement.renderDistance
    ) {
      visibleElementsHeap.push(node);
    }
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
      notRenderedElements.delete(element);
      container.removeChild(element);
      element.destroy();
    });
    elements.delete(ped);
  }
}

function renderElement(node: alt.RmlElement) {
  const registeredElement = registeredElements.get(node.key);

  if (!registeredElement) {
    alt.log("Registered element not found");
    return;
  }

  const ped = node.entity;

  markElementAsVisible(node);

  const scale = calculateNpcElementScale(ped.frameData.distance);

  const element = registeredElement.render({
    ped,
    scale,
  });

  renderer.render(element, node);

  notRenderedElements.delete(node);
}

function calculateNpcElementScale(camDistToPed: number) {
  const { x: screenX, y: screenY } = alt.getScreenResolution();
  const aspectRatio = screenX / screenY; // Aspect ratio of the screen
  const screenDiagonal = Math.sqrt(screenX ** 2 + screenY ** 2);
  const scale = screenDiagonal / 2600;

  // Calculate the inverse distance factor
  const inverseDistanceFactor = 1 / (Math.min(camDistToPed, 15) + 0.00001);

  // Now the scaleFactor combines both the inverse distance and the perspective projection
  const scaleFactor = inverseDistanceFactor * 3;

  // Calculate the scale of of font size
  return Math.min(1, scaleFactor * aspectRatio) * scale;
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
