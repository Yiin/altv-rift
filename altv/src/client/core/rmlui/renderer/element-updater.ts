import alt from "@altv/client";
import game from "@altv/natives";
import { computed } from "vue";
import { focusableElements, registeredElements } from "./element-registry";
import { notRenderedElements, visibleElementsHeap } from "./frame-state";
import { container, document } from "./element-renderer";
import { elements } from "./rml-renderer";
import { AnchorEntity, FrameData } from "./types";
import { updateFocusedEntity } from "./hooks/focused-entity";
import { AnchorType } from "./anchors";

export const frameDataMap = new Map<AnchorEntity, FrameData>();

let screenRes = alt.getScreenResolution().div(
  2.2, // 2.2 feels a bit more natural, as the player ped is not in the center of the screen, but a bit left from it
  2,
);

alt.Events.onWindowResolutionChange(({ newResolution }) => {
  screenRes = newResolution.div(2.2, 2);
});

export function isValidAnchor(entity: alt.BaseObject): entity is AnchorEntity {
  return getAnchorType(entity) !== null;
}

export function getAnchorType(entity: alt.BaseObject): AnchorType | null {
  if (entity.valid) {
    if (entity.type === alt.Enums.BaseObjectType.PED) {
      return AnchorType.Ped;
    }
    if (entity.type === alt.Enums.BaseObjectType.PLAYER) {
      return AnchorType.Player;
    }
    if (entity.type === alt.Enums.BaseObjectType.VEHICLE) {
      return AnchorType.Vehicle;
    }
    if (entity.type === alt.Enums.BaseObjectType.VIRTUAL_ENTITY) {
      if ((entity as alt.VirtualEntity).streamSyncedMeta.entityType === "tree") {
        return AnchorType.Tree;
      }
      if ((entity as alt.VirtualEntity).streamSyncedMeta.entityType === "storage") {
        return AnchorType.Storage;
      }
    }
  }
  return null;
}

export function prepareFrameForEntity(entity: AnchorEntity): void {
  const isVisible =
    alt.isPointOnScreen(entity.pos) &&
    (entity instanceof alt.Entity
      ? game.hasEntityClearLosToEntity(alt.Player.local, entity, 17)
      : game.isSphereVisible(entity.pos.x, entity.pos.y, entity.pos.z, 0.0099999998));

  if (isVisible) {
    const screenPosition = alt.worldToScreen(entity.pos);
    const zIndex = ~~(screenPosition.z * 100000);

    const anchorType = getAnchorType(entity);

    if (!anchorType) {
      return;
    }

    const focusableElement = focusableElements.get(anchorType);

    if (focusableElement) {
      if (alt.Player.local.pos.distanceTo(entity.pos) <= focusableElement.renderDistance) {
        const distanceToCenter = screenRes.distanceTo(screenPosition);

        updateFocusedEntity(entity, distanceToCenter);
      }
    }

    frameDataMap.set(entity, {
      screen: screenPosition,
      zIndex,
      isVisible,
    });
  } else {
    if (!frameDataMap.has(entity) || frameDataMap.get(entity)!.isVisible) {
      frameDataMap.set(entity, {
        screen: new alt.Vector3(0),
        zIndex: 0,
        isVisible,
      });
    }
  }

  prepareEntityElements(entity);
}

export function prepareEntityElements(entity: AnchorEntity): void {
  const frameData = frameDataMap.get(entity)!;
  const elementsMap = elements.has(entity)
    ? elements.get(entity)!
    : new Map<string, alt.RmlElement>();

  for (const [key, registeredElement] of registeredElements) {
    if (registeredElement.anchorType !== getAnchorType(entity)) {
      continue;
    }
    if (!elementsMap.has(key)) {
      const node = document.createElement("div");

      node.addClass("hide");
      node.style["z-index"] = frameData.zIndex.toString();
      node.key = key;
      node.entity = entity;
      node.isFresh = true;
      node.renderedContent = computed(
        () => {
          if (node.cleanup?.length) {
            node.cleanup.forEach((fn) => fn());
          }
          node.cleanup = [];
          node.hooks = [];

          return registeredElement.render({ entity });
        },
        {
          onTrigger() {
            node.isFresh = true;
          },
        },
      );

      container.appendChild(node);
      elementsMap.set(key, node);
    }
    const node = elementsMap.get(key)!;

    notRenderedElements.add(node);

    const pos = registeredElement.anchorPos?.(entity) ?? entity.pos;

    if (
      frameData.isVisible &&
      alt.Player.local.pos.distanceTo(pos) <= registeredElement.renderDistance
    ) {
      visibleElementsHeap.push(node);
    }
  }

  if (!elements.has(entity)) {
    elements.set(entity, elementsMap);
  }
}
