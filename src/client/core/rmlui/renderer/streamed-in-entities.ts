import * as alt from "@altv/client";
import { objectExpression } from "@babel/types";
import { getAnchorType } from "./element-updater";
import { AnchorEntity } from "./types";
import { elements } from "./rml-renderer";
import { notRenderedElements } from "./frame-state";
import { container } from "./element-renderer";

export const streamedInEntities = new Set<AnchorEntity>();

alt.Events.onGameEntityCreate(({ entity }) => {
  try {
    getAnchorType(entity as AnchorEntity);
    streamedInEntities.add(entity as AnchorEntity);
  } catch {}
});

alt.Events.onGameEntityDestroy(({ entity }) => {
  removeOrphanedElement(entity as AnchorEntity);
});

alt.Events.onWorldObjectStreamIn(({ object }) => {
  try {
    getAnchorType(object as AnchorEntity);
    streamedInEntities.add(object as AnchorEntity);
  } catch {}
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
