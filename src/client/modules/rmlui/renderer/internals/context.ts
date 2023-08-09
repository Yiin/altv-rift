import alt from "alt-client";
import { computed, ComputedRef, toRaw } from "vue";
import { AnchorType } from "../anchors";
import { ElementRegistration } from "../types";

const contexts = new WeakMap<alt.RmlElement, ComputedRef<any>>();

export function updateContext(
  node: alt.RmlElement,
  registeredElement: ElementRegistration<AnchorType, any>
) {
  if (
    registeredElement.context &&
    (!contexts.has(node) ||
      registeredElement.context?.shouldUpdateContext?.({ entity: node.entity }))
  ) {
    contexts.set(
      node,
      computed(() => registeredElement.context?.updateContext({ entity: node.entity }))
    );
  }
}

export function getContext(node: alt.RmlElement) {
  return contexts.get(node)?.value;
}
