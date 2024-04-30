/**
 * https://codepen.io/Yiin/pen/vYMMZBp?editors=1111
 */

import alt from "@altv/client";
import game from "@altv/natives";
import { whileInGame } from "@/core/game-state-hooks/in-game.state";
import { document } from "../../renderer/element-renderer";
import { createTextNode, updateTextNode } from "../../renderer/rml-renderer";
import { px } from "../../renderer/pixel";

const SPACE_BETWEEN_TICKS = 58;
const TICK_INTERVAL = 15;
const TICK_COUNT = 13;

const compass = document.createElement("div");
compass.addClass("compass");
compass.style.left = `${alt.getScreenResolution().x / 2 - px(203)}px`;
document.body.appendChild(compass);

alt.Events.onWindowResolutionChange(({ newResolution }) => {
  compass.style.left = `${newResolution.x / 2 - px(203)}px`;
});

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
    const side = {
      0: "N",
      90: "E",
      180: "S",
      270: "W",
    }[missingValues[index]];

    const label = node.querySelector(".compass__tick-label")!;
    const labelText = side || missingValues[index];

    if (label.childNodes.length) {
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

whileInGame(() => {
  const timer = alt.Timers.everyTick(() => {
    direction = game.getGameplayCamRot(2).z;

    direction = direction < 0 ? 360 + direction : direction;
    direction = direction % 360;

    updateTicks(direction);

    const leftTickValue = updatedTickValues[6];
    const offset =
      Math.min(
        (TICK_INTERVAL + direction - leftTickValue) % TICK_INTERVAL,
        (TICK_INTERVAL + direction - leftTickValue) % TICK_INTERVAL,
      ) * px(SPACE_BETWEEN_TICKS / TICK_INTERVAL);

    const width = 812;
    const middle = width / 2;
    const visibleWidthPercentage = 0.5;
    const start = px(middle - middle * visibleWidthPercentage);
    const end = px(middle + middle * visibleWidthPercentage);
    const spaceBetweenTicks = px(SPACE_BETWEEN_TICKS);

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
        ) ** 8;

      if (node) {
        node.style.transform = `translateX(${translateX}px)`;
        node.style.opacity = opacity.toString();
      }
    });
  });

  return () => {
    timer.destroy();
  };
});
