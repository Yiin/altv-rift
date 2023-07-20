import alt from "alt-client";
import { join } from "@shared/utility/path";
import { createRenderer } from "./rml-renderer";
import { notRenderedElements } from "./frame-state";
import { registeredElements } from "./element-registry";

alt.RmlElement.prototype.shown = false;

export const document = new alt.RmlDocument(
  join(__relativedirname, "../screen.rml")
);
// We're storing the container for further usage, e.g. adding and removing elements
export const container = document.getElementByID("container")!;

export const renderer = createRenderer(document);

export function renderElement(node: alt.RmlElement) {
  const registeredElement = registeredElements.get(node.key);

  if (!registeredElement) {
    alt.log("Registered element not found");
    return;
  }

  const entity = node.entity;

  markElementAsVisible(node);

  const scale = calculateNpcElementScale(entity.frameData.distance);

  const element = registeredElement.render({
    entity,
    scale,
  });

  if (!element) {
    return;
  }

  renderer.render(element, node);

  notRenderedElements.delete(node);
}

export function calculateNpcElementScale(camDistToPed: number) {
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

export function markElementAsVisible(element: alt.RmlElement) {
  if (element.shown) {
    return;
  }

  element.removeClass("hide");
  element.shown = true;
}

export function markElementAsHidden(element: alt.RmlElement) {
  if (!element.shown) {
    return;
  }

  element.addClass("hide");
  element.shown = false;
}
