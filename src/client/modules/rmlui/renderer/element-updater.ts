import alt from "alt-client";
import game from "natives";
import { registeredElements } from "./element-registry";
import { notRenderedElements, visibleElementsHeap } from "./frame-state";
import { container, document } from "./element-renderer";
import { elements } from "./rml-renderer";
import { AnchorEntity, FrameData } from "./types";

export const frameDataMap = new Map<AnchorEntity, FrameData>();

alt.on("gameEntityDestroy", (entity) => {
  removeOrphanedElements(entity as AnchorEntity);
});

export function prepareFrameForEntity(entity: AnchorEntity) {
  const camPos = alt.getCamPos();
  const distance = camPos.distanceTo(entity.pos);
  const zIndex = ~~(1000000 - distance * 10000);

  const isVisible =
    game.isSphereVisible(entity.pos.x, entity.pos.y, entity.pos.z, 0.01) &&
    game.hasEntityClearLosToEntity(alt.Player.local, entity, 17);

  frameDataMap.set(entity, {
    distance,
    zIndex,
    isVisible,
  });

  prepareEntityElements(entity);
}

export function prepareEntityElements(entity: AnchorEntity) {
  const frameData = frameDataMap.get(entity)!;
  const elementsMap = elements.has(entity)
    ? elements.get(entity)!
    : new Map<string, alt.RmlElement>();

  for (const [key, registeredElement] of registeredElements) {
    if (!elementsMap.has(key)) {
      const node = document.createElement("div");

      node.addClass("hide");
      node.style["z-index"] = frameData.zIndex.toString();
      node.key = key;
      node.entity = entity;

      container.appendChild(node);
      elementsMap.set(key, node);
    }
    const node = elementsMap.get(key)!;

    notRenderedElements.add(node);

    if (
      frameData.isVisible &&
      frameData.distance <= registeredElement.renderDistance
    ) {
      visibleElementsHeap.push(node);
    }
  }

  if (!elements.has(entity)) {
    elements.set(entity, elementsMap);
  }
}

function removeOrphanedElements(entity: AnchorEntity) {
  if (!elements.has(entity)) {
    return;
  }
  const elementsMap = elements.get(entity)!;

  elementsMap.forEach((element) => {
    notRenderedElements.delete(element);
    container.removeChild(element);
    element.destroy();
  });

  elements.delete(entity);
}
