import alt from "alt-client";
import { getAnchorType } from "./element-updater";
import { AnchorEntity } from "./types";
import { elements } from "./rml-renderer";
import { notRenderedElements } from "./frame-state";
import { container } from "./element-renderer";

export const streamedInEntities = new Set<AnchorEntity>();

alt.on("gameEntityCreate", (entity) => {
  try {
    getAnchorType(entity as AnchorEntity);
    streamedInEntities.add(entity as AnchorEntity);
  } catch {}
});

alt.on("gameEntityDestroy", (entity) => {
  removeOrphanedElement(entity as AnchorEntity);
});

alt.on("worldObjectStreamIn", (entity) => {
  try {
    getAnchorType(entity as AnchorEntity);
    streamedInEntities.add(entity as AnchorEntity);
  } catch {}
});

alt.on("worldObjectStreamOut", (entity) => {
  removeOrphanedElement(entity as AnchorEntity);
});

function removeOrphanedElement(entity: AnchorEntity) {
  if (!streamedInEntities.has(entity)) {
    return;
  }
  streamedInEntities.delete(entity);

  const elementsMap = elements.get(entity)!;

  if (elementsMap) {
    elementsMap.forEach((element) => {
      notRenderedElements.delete(element);
      container.removeChild(element);
      element.destroy();
    });
  }

  elements.delete(entity);
}
