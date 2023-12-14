import * as alt from "@altv/client";
import { clientState } from "@/core/store/client.store";
import { renderElement, markElementAsHidden } from "./element-renderer";
import { prepareFrameForEntity } from "./element-updater";
import { visibleElementsHeap, notRenderedElements } from "./frame-state";
import { resetFocusedEntity } from "./hooks/focused-entity";
import { updateMenu } from "./hooks/use-menu";
import { setCurrentNode } from "./internals/current-node";
import { streamedInEntities } from "./streamed-in-entities";

alt.Events.onConsoleCommand(({ command }) => {
  if (command === "win") {
    alt.log(clientState.ui.window);
  }
});

alt.Timers.everyTick(() => {
  // Cleanup previous frame
  visibleElementsHeap.clear();
  notRenderedElements.clear();
  resetFocusedEntity();

  streamedInEntities.forEach(prepareFrameForEntity);

  if (clientState.ui.window) {
    // Reset the current node
    setCurrentNode(null);

    // Hide elements that are not shown because of the limit
    notRenderedElements.forEach(markElementAsHidden);
    return;
  }

  updateMenu();

  // Update the positions of elements that are still visible
  (visibleElementsHeap.consume() as alt.RmlElement[]).forEach(renderElement);

  // Reset the current node
  setCurrentNode(null);

  // Hide elements that are not shown because of the limit
  notRenderedElements.forEach(markElementAsHidden);
});
