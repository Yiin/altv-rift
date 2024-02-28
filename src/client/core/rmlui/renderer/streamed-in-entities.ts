import alt from "@altv/client";
import { isValidAnchor } from "./element-updater";
import { AnchorEntity } from "./types";
import { elements } from "./rml-renderer";
import { notRenderedElements } from "./frame-state";
import { container } from "./element-renderer";

export const streamedInEntities = new Set<AnchorEntity>();

alt.Events.onGameEntityCreate(({ entity }) => {
  if (isValidAnchor(entity)) {
    streamedInEntities.add(entity);
  }
});

alt.Events.onGameEntityDestroy(({ entity }) => {
  removeOrphanedElement(entity as AnchorEntity);
});

alt.Events.onWorldObjectStreamIn(({ object }) => {
  if (isValidAnchor(object)) {
    streamedInEntities.add(object);
  }
});

alt.Events.onWorldObjectStreamOut(({ object }) => {
  removeOrphanedElement(object as AnchorEntity);
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
