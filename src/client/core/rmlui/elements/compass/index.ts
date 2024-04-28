import alt from "@altv/client";
import game from "@altv/natives";
import { document } from "../../renderer/element-renderer";
import { createTextNode, updateTextNode } from "../../renderer/rml-renderer";

const compassContainer = document.createElement("div");

document.body.appendChild(compassContainer);

const tickNodes = Array.from({ length: 13 }).map((_, index) => {
  const node = document.createElement("div");
  const value = index * 15;

  node.meta.tickValue = value;
  node.style.transform = `translateX(${index * 15}px)`;

  const text = createTextNode(document, value.toString());
  node.appendChild(text);

  return node;
});

// <div id="0">0</div>
// <div id="1">15</div>
// <div id="2">30</div>
// <div id="3">45</div>
// <div id="4">60</div>
// <div id="5">75</div>
// <div id="6">90</div>
// <div id="7">105</div>
// <div id="8">120</div> // target direction = 130
// <div id="9">135</div>
// <div id="10">150</div>
// <div id="11">165</div>
// <div id="12">180</div>

// visible = [45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225]
// invisible = [0, 15, 30]
// ids = [0, 1, 2]
// update = [195, 210, 225]

// <div id="3">45</div>
// <div id="4">60</div>
// <div id="5">75</div>
// <div id="6">90</div>
// <div id="7">105</div>
// <div id="8">120</div>
// <div id="9">135</div>
// <div id="10">150</div>
// <div id="11">165</div>
// <div id="12">180</div>
// <div id="0">195</div>
// <div id="1">210</div>
// <div id="2">225</div>

let lastDirectionTick = 0;

alt.Timers.everyTick(() => {
  const currentCameraHeadingDegrees = game.getGameplayCamRot(2).z;

  updateTicks(currentCameraHeadingDegrees);

  // update position of ticks
});

function updateTicks(targetAngle: number) {
  const directionTick = Math.round(targetAngle / 15);

  if (directionTick === lastDirectionTick) {
    // no need to update dom, we good
    return;
  }

  const minAngle = Math.round(targetAngle / 15) * 15 - 90;
  const maxAngle = Math.round(targetAngle / 15) * 15 + 90;

  const updatedTickValues = Array.from({ length: 13 }).map((_, index) => {
    return minAngle + index * 15;
  });

  /**
   * Tick elements that should be updated
   */
  const missmatchedTicks = tickNodes.filter((node, index) => {
    return updatedTickValues[index] !== node.meta.tickValue;
  });

  /**
   * Tick values that should be applied to missmatched ticks
   */
  const missingValues = updatedTickValues.filter((value) => {
    return !tickNodes.some((node) => node.meta.tickValue === value);
  });

  missmatchedTicks.forEach((node, index) => {
    // update tick value
    node.meta.tickValue = missingValues[index];

    // update text node
    const textNode = node.firstChild
      ? updateTextNode(document, node.firstChild, missingValues[index].toString())
      : createTextNode(document, missingValues[index].toString());

    if (!node.firstChild) {
      node.appendChild(textNode);
    } else if (textNode !== node.firstChild) {
      node.replaceChild(textNode, node.firstChild);
    }
  });

  lastDirectionTick = directionTick;
}
