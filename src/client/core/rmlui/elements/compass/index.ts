/**
 * https://codepen.io/Yiin/pen/vYMMZBp?editors=1111
 */

import alt from "@altv/client";
import game from "@altv/natives";
import { whileInGame } from "@/core/game-state-hooks/in-game.state";
import { document } from "../../renderer/element-renderer";
import { createRmlElement, createTextNode, updateTextNode } from "../../renderer/rml-renderer";
import { px } from "../../renderer/pixel";
import { img } from "../../renderer/rml-tags";

const SPACE_BETWEEN_TICKS = 58;
const TICK_INTERVAL = 15;

const compass = document.createElement("div");
compass.addClass("compass");
compass.style.left = `${alt.getScreenResolution().x / 2 - px(203)}px`;
document.body.appendChild(compass);

alt.Events.onWindowResolutionChange(({ newResolution }) => {
  compass.style.left = `${newResolution.x / 2 - px(203)}px`;
});

const compassBackground = createRmlElement(
  document,
  img({
    style: {
      display: "block",
      position: "absolute",
      top: "0",
      left: "50%",
      transform: `translate(-50%, -50%)`,
      width: "32.8125rem",
      height: "18.75rem",
      opacity: "0.3",
    },
    src: `elements/compass/background.png`,
  }),
);
// compass.appendChild(compassBackground);

const compassContainer = document.createElement("div");
compassContainer.addClass("compass__container");
compass.appendChild(compassContainer);

const compassTicks = document.createElement("div");
compassTicks.addClass("compass__ticks");
compassContainer.appendChild(compassTicks);

const center = document.createElement("div");
center.addClass("compass__center");
compassContainer.appendChild(center);

const tickNodes = Array.from({ length: 13 }, () => {
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

  updatedTickValues = Array.from({ length: 13 }).map((_, index) => {
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

let cd = Date.now();

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

    // 0 870
    // start: 0 end: 870
    // middle width: 50%
    // middle start: 217.5
    // middle end: 652.5

    // 193 734

    const width = 812;
    const middle = width / 2;
    const visibleWidthPercentage = 0.5;
    const start = px(middle - middle * visibleWidthPercentage);
    const end = px(middle + middle * visibleWidthPercentage);

    updatedTickValues.forEach((tickValue, index) => {
      const node = tickNodes.find((node) => node.tickValue === tickValue);

      const translateX = index * px(SPACE_BETWEEN_TICKS) - offset;

      const position = translateX + px(SPACE_BETWEEN_TICKS);
      const opacity =
        Math.max(
          0,
          position < start
            ? position / start
            : position > end
              ? 1 - (position - end) / (start - px(SPACE_BETWEEN_TICKS))
              : 1,
        ) ** 8;

      if (cd < Date.now()) {
        console.log(index, {
          translateX,
          position,
          opacity,
        });
      }

      if (node) {
        node.style.transform = `translateX(${translateX}px)`;
        node.style.opacity = opacity.toString();
      }
    });

    if (cd < Date.now()) {
      cd = Date.now() + 10000;
      console.log({
        start,
        end,
      });
    }
  });

  return () => {
    timer.destroy();
  };
});
