/**
 * https://codepen.io/Yiin/pen/vYMMZBp?editors=1111
 */

import alt from "@altv/client";
import game from "@altv/natives";
import { VirtualEntityType } from "@shared/interfaces";
import { whileInGame } from "@/core/game-state-hooks/in-game.state";
import { whileVirtualEntityIsStreamedIn } from "@/core/game-state-hooks/virtual-entity-is-streamed-in.state";
import { document } from "../../renderer/element-renderer";
import { createTextNode, updateTextNode } from "../../renderer/rml-renderer";
import { px } from "../../renderer/pixel";
import { whileEntityIsStreamedIn } from "@/core/game-state-hooks/entity-is-streamed-in.state";
import { isQuestPed } from "@/modules/peds/lib/is-quest-ped";
import { watchEffect } from "@yiin/reactive-proxy-state";

const SPACE_BETWEEN_TICKS = 58;
const TICK_INTERVAL = 15;
const TICK_COUNT = 13;
const PX_PER_DEGREE = SPACE_BETWEEN_TICKS / TICK_INTERVAL;
const MIDDLE_OFFSET = Math.ceil(TICK_COUNT / 2) * SPACE_BETWEEN_TICKS - SPACE_BETWEEN_TICKS / 2;
const COMPASS_DIRECTIONS: Partial<Record<number, string>> = { 0: "N", 90: "E", 180: "S", 270: "W" };

const compass = document.createElement("div");
compass.addClass("compass");
compass.style.display = "none";
compass.style.left = `${alt.getScreenResolution().x / 2 - px(203)}px`;
document.body.appendChild(compass);

const compassContainer = document.createElement("div");
compassContainer.addClass("compass__container");
compass.appendChild(compassContainer);

const compassTicks = document.createElement("div");
compassTicks.addClass("compass__ticks");
compassContainer.appendChild(compassTicks);

const center = document.createElement("div");
center.addClass("compass__center");
compassContainer.appendChild(center);

const tickNodes = Array.from({ length: TICK_COUNT }, () => {
  const node = document.createElement("div");
  node.addClass("compass__tick");
  compassTicks.appendChild(node);

  const tickContainer = document.createElement("div");
  tickContainer.addClass("compass__tick-container");
  node.appendChild(tickContainer);

  const label = document.createElement("div");
  label.addClass("compass__tick-label");
  tickContainer.appendChild(label);

  const indicator = document.createElement("div");
  indicator.addClass("compass__tick-indicator");
  tickContainer.appendChild(indicator);

  return node;
});

const nearbyPointsDiv = document.createElement("div");
nearbyPointsDiv.addClass("compass__icons");
compassContainer.appendChild(nearbyPointsDiv);

const nearbyPoints: {
  calc(): { direction: number; distance: number };
  type: string;
  node: alt.RmlElement;
}[] = [];

function calculateBearing(x1: number, y1: number, x2: number, y2: number): number {
  const deltaX = x2 - x1;
  const deltaY = y2 - y1;
  const angleRadians = Math.atan2(deltaY, deltaX);
  let angleDegrees = angleRadians * (180 / Math.PI);
  let bearing = (90 - angleDegrees + 360) % 360;

  return bearing;
}

function addNearbyPoint(pos: () => alt.Vector3, type: string) {
  const node = document.createElement("div");
  node.addClass("compass__icon");
  nearbyPointsDiv.appendChild(node);

  const iconContainer = document.createElement("div");
  iconContainer.addClass("compass__icon-container");
  node.appendChild(iconContainer);

  const caret = document.createElement("img");
  caret.addClass("compass__icon-caret");
  caret.setAttribute("src", "elements/compass/caret.png");
  iconContainer.appendChild(caret);

  const actualIcon = document.createElement("img");
  actualIcon.addClass("compass__icon-uhh-actual-icon-i-guess");
  actualIcon.setAttribute("src", `components/icon/assets/icon-${type}.png`);
  iconContainer.appendChild(actualIcon);

  const distanceLabel = document.createElement("div");
  distanceLabel.addClass("compass__icon-distance");
  const text = createTextNode(document, ``);
  distanceLabel.appendChild(text);
  iconContainer.appendChild(distanceLabel);

  const nearbyPoint = {
    calc() {
      const playerPos = alt.Player.local.pos;
      const targetPos = pos();

      const direction = calculateBearing(playerPos.x, playerPos.y, targetPos.x, targetPos.y);
      const distance = Math.round(playerPos.distanceTo(targetPos));

      return { direction, distance };
    },
    type,
    node,
  };
  nearbyPoints.push(nearbyPoint);

  return nearbyPoint;
}

function removeNearbyPoint(node: alt.RmlElement) {
  const index = nearbyPoints.findIndex((point) => point.node === node);
  if (index === -1) {
    return;
  }

  nearbyPoints.splice(index, 1);
  node.parent?.removeChild(node);
  node.destroy();
}

let lastDirectionTick: number | undefined = undefined;
let direction = 0;

let updatedTickValues: number[] = [];

function updateTicks(targetAngle: number) {
  const directionTick = Math.floor(targetAngle / TICK_INTERVAL);

  if (directionTick === lastDirectionTick) {
    // no need to update dom, we good
    return;
  }

  let minAngle = directionTick * TICK_INTERVAL - 90;
  if (minAngle < 0) {
    minAngle = 360 + minAngle;
  }

  updatedTickValues = Array.from({ length: TICK_COUNT }).map((_, index) => {
    return (minAngle + index * TICK_INTERVAL) % 360;
  });

  /**
   * Tick elements that should be updated
   */
  const missmatchedTicks = tickNodes.filter((node) => {
    return !updatedTickValues.includes(node.tickValue);
  });

  /**
   * Tick values that should be applied to missmatched ticks
   */
  const missingValues = updatedTickValues.filter((value) => {
    return !tickNodes.some((node) => node.tickValue === value);
  });

  missmatchedTicks.forEach((node, index) => {
    // update tick value
    node.tickValue = missingValues[index];

    // update text node
    const side = COMPASS_DIRECTIONS[missingValues[index]];

    const label = node.querySelector(".compass__tick-label")!;
    const labelText = side || missingValues[index];

    if (!label) {
      console.warn(`[Compass] No label found for tick ${missingValues[index]}`, {
        index,
        missingValues,
        tickNodes,
      });
      return;
    }

    if (label.childNodes[0]) {
      updateTextNode(document, label.childNodes[0], labelText.toString());
    } else {
      const textNode = createTextNode(document, labelText.toString());
      label.appendChild(textNode);
    }

    if (side) {
      node.addClass("compass__tick--side");
    } else {
      node.removeClass("compass__tick--side");
    }
  });

  lastDirectionTick = directionTick;
}

function updateIcons(currentDirection: number) {
  const directionTick = Math.floor(currentDirection / TICK_INTERVAL);

  let minAngle = directionTick * TICK_INTERVAL - 90;
  if (minAngle < 0) {
    minAngle = 360 + minAngle;
  }

  let maxAngle = minAngle + 180;
  if (maxAngle > 360) {
    maxAngle -= 360;
  }

  let closestNode: alt.RmlElement | null = null;
  let closestDiff = 360;

  nearbyPoints.forEach(({ calc, node }) => {
    const { direction, distance } = calc();

    let diff = Math.min(
      (360 + direction - currentDirection) % 360,
      (360 + direction - currentDirection) % 360,
    );

    if (diff > 180) {
      diff = diff - 360;
    }

    const offset = px(MIDDLE_OFFSET) + diff * px(PX_PER_DEGREE) - px(SPACE_BETWEEN_TICKS) / 2;

    const absdiff = Math.abs(diff);

    if (absdiff < closestDiff) {
      closestDiff = absdiff;
      closestNode = node;
    }

    // if absdiff is greater than 50, the opacity should decrease from
    // 1 at 50 to 0 at 70
    const opacity = absdiff >= 50 ? Math.max(0, 1 - (absdiff - 50) / 20) ** 8 : 1;

    const distanceNode = node.querySelector(".compass__icon-distance")!;
    const text = distance.toString();

    if (distanceNode.childNodes[0]) {
      updateTextNode(document, distanceNode.childNodes[0], text);
    } else {
      const textNode = createTextNode(document, text);
      distanceNode.appendChild(textNode);
    }

    node.style.transform = `translateX(${offset}px)`;
    node.style.opacity = opacity.toString();
  });

  nearbyPoints.forEach(({ node }) => {
    if (closestNode !== node) {
      node.style.opacity = (+node.style.opacity / 2).toString();
    }
  });
}

whileInGame(() => {
  compass.style.display = "block";

  const stopAreaOfInterestListener = whileVirtualEntityIsStreamedIn(
    (entity) => entity.streamSyncedMeta.entityType === VirtualEntityType.AreaOfInterest,
    (entity) => {
      const { node } = addNearbyPoint(() => entity.pos, entity.streamSyncedMeta.areaType!);

      return () => {
        removeNearbyPoint(node);
      };
    },
  );

  const stopEntityListener = whileEntityIsStreamedIn(
    (entity): entity is alt.Ped => entity instanceof alt.Ped,
    (entity) => {
      let node: alt.RmlElement | null = null;

      const stopWatching = watchEffect((onCleanup) => {
        if (isQuestPed(entity)) {
          const point = addNearbyPoint(() => entity.pos, "quest");
          node = point.node;
        }

        onCleanup(() => {
          if (node) {
            removeNearbyPoint(node);
            node = null;
          }
        });
      });

      return () => {
        console.log("stop watching");
        stopWatching();

        if (node) {
          console.log("removing nearby point");
          removeNearbyPoint(node);
        }
      };
    },
  );

  const width = 812;
  const middle = width / 2;
  const visibleWidthPercentage = 0.5;
  let start = px(middle - middle * visibleWidthPercentage);
  let end = px(middle + middle * visibleWidthPercentage);
  let spaceBetweenTicks = px(SPACE_BETWEEN_TICKS);

  const windowResizeListener = alt.Events.onWindowResolutionChange(({ newResolution }) => {
    // px might not be updated immediately, so we wait a tick
    alt.Timers.nextTick(() => {
      start = px(newResolution.x / 2 - (newResolution.x / 2) * visibleWidthPercentage);
      end = px(newResolution.x / 2 + (newResolution.x / 2) * visibleWidthPercentage);
      spaceBetweenTicks = px(SPACE_BETWEEN_TICKS);
      compass.style.left = `${newResolution.x / 2 - px(203)}px`;
    });
  });

  const timer = alt.Timers.everyTick(() => {
    if (!alt.isGameFocused()) {
      return;
    }

    direction = (360 - (game.getGameplayCamRot(2).z % 360)) % 360;

    updateTicks(direction);
    updateIcons(direction);

    const leftTickValue = updatedTickValues[6];
    const offset =
      Math.min(
        (TICK_INTERVAL + direction - leftTickValue) % TICK_INTERVAL,
        (TICK_INTERVAL + direction - leftTickValue) % TICK_INTERVAL,
      ) * px(PX_PER_DEGREE);

    updatedTickValues.forEach((tickValue, index) => {
      const node = tickNodes.find((node) => node.tickValue === tickValue);

      const translateX = index * spaceBetweenTicks - offset;

      const position = translateX + spaceBetweenTicks;
      const opacity =
        Math.max(
          0,
          position < start
            ? position / start
            : position > end
              ? 1 - (position - end) / (start - spaceBetweenTicks)
              : 1,
        ) ** 8; // ** for exponential opacity change, otherwise it takes too long and looks weird

      if (node) {
        node.style.transform = `translateX(${translateX}px)`;
        node.style.opacity = opacity.toString();
      }
    });
  });

  return () => {
    compass.style.display = "none";
    timer.destroy();
    windowResizeListener.destroy();
    stopAreaOfInterestListener();
    stopEntityListener();
  };
});
