import alt from "alt-client";
import FixedReverseHeap from "mnemonist/fixed-reverse-heap";
import { MAX_RENDERED_ELEMENTS } from "./config";

export const notRenderedElements = new Set<alt.RmlElement>();

export const visibleElementsHeap = new FixedReverseHeap<alt.RmlElement>(
  Array,
  (a, b) => b.zIndex - a.zIndex,
  MAX_RENDERED_ELEMENTS
);
