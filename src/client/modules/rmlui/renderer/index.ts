import alt from "alt-client";
import { renderElement, markElementAsHidden } from "./element-renderer";
import { prepareFrameForEntity } from "./element-updater";
import { visibleElementsHeap, notRenderedElements } from "./frame-state";

alt.everyTick(() => {
  // Cleanup previous frame
  visibleElementsHeap.clear();
  notRenderedElements.clear();

  // AnchorType.Ped
  alt.Ped.streamedIn.forEach(prepareFrameForEntity);

  // Update the positions of elements that are still visible
  (visibleElementsHeap.consume() as alt.RmlElement[]).forEach(renderElement);

  // Hide elements that are not shown because of the limit
  notRenderedElements.forEach(markElementAsHidden);
});
