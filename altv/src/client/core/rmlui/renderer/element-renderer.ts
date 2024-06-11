import alt from "@altv/client";
import { join } from "@shared/utility/path";
import { createRenderer } from "./rml-renderer";
import { notRenderedElements } from "./frame-state";
import { registeredElements } from "./element-registry";
import { setCurrentNode } from "./internals/current-node";

// Some defaults
alt.RmlElement.prototype.shown = false;

// Main document
export const document = alt.RmlDocument.create({
  url: join(__relativedirname, "../screen.rml"),
});

// Container we render to
export const container = document.getElementByID("container")!;

// Global renderer
export const renderer = createRenderer(document);

/**
 * Tries to render the element
 */
export function renderElement(node: alt.RmlElement): void {
  if (!node.valid) {
    return;
  }

  const registeredElement = registeredElements.get(node.key);

  if (!registeredElement) {
    alt.log("Registered element not found");
    return;
  }

  setCurrentNode(node);

  markElementAsVisible(node);

  const element = node.renderedContent.value;

  if (!element) {
    return;
  }

  if (node.isFresh) {
    node.isFresh = false;
    console.log(`Node is not fresh, re-render`, registeredElement.key);
    renderer.render(element, node);
  }

  const entity = node.entity;
  const pos = registeredElement.anchorPos?.(entity) ?? entity.pos;
  const distance = alt.Cam.pos.distanceTo(pos);
  const scale = calculateElementScale(distance);

  node.hooks.forEach((hook) => hook({ scale, distance, pos }));

  notRenderedElements.delete(node);
}

export function calculateElementScale(camDistToPed: number): number {
  const fov = 50; // Field of View
  const avgPedHeight = 2; // Average pedestrian height

  // The scaling formula can be adjusted as needed
  // Here we use a simple linear relationship for demonstration
  const scale = Math.min(1.5, 6 / camDistToPed);

  return scale;
  // const { x: screenX, y: screenY } = alt.getScreenResolution();
  // const aspectRatio = screenX / screenY; // Aspect ratio of the screen
  // const screenDiagonal = Math.sqrt(screenX ** 2 + screenY ** 2);
  // const scale = screenDiagonal / 2600;

  // // Calculate the inverse distance factor
  // const inverseDistanceFactor = 1 / (Math.min(camDistToPed, 15) + 0.00001);

  // // Now the scaleFactor combines both the inverse distance and the perspective projection
  // const scaleFactor = inverseDistanceFactor * 3;

  // // Calculate the scale of font size
  // return Math.min(1, scaleFactor * aspectRatio) * scale;
}

export function markElementAsVisible(element: alt.RmlElement): void {
  if (element.shown) {
    return;
  }

  element.removeClass("hide");
  element.shown = true;
}

export function markElementAsHidden(element: alt.RmlElement): void {
  if (!element.shown) {
    return;
  }

  element.addClass("hide");
  element.shown = false;
}

export function hideRml() {
  document.body.style.display = "none";
}

export function showRml() {
  document.body.style.display = "block";
}
