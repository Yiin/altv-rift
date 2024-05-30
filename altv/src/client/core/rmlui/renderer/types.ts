import alt from "@altv/client";
import { ComputedRef } from "vue";
import { AnchorEntityMap, AnchorType } from "./anchors";

declare module "@altv/client" {
  interface RmlElement {
    // Rendering
    entity: AnchorEntity;
    shown: boolean;
    key: string;
    isFresh: boolean;
    renderedContent: ComputedRef<ParsedElement | null>;
    hooks: ((props: { scale: number; distance: number; pos: alt.Vector3 }) => void)[];
    cleanup: (() => void)[];

    // Compass
    tickValue: number;
  }
}

export type AnchorEntity = AnchorEntityMap[keyof AnchorEntityMap];

export interface FrameData {
  screen: alt.Vector3;
  zIndex: number;
  isVisible: boolean;
}

export interface ElementRegistration<T extends AnchorType, X> {
  key: string;
  renderDistance: number;
  anchorType: T;
  anchorPos?(entity: AnchorEntityMap[T]): alt.Vector3;
  focusable?: boolean;
  render(props: { entity: AnchorEntityMap[T] }): ParsedElement | null;
}

export interface ParsedNode {
  tagName: string;
  classNames: string[];
  props: Record<string, any> & {
    style?: Record<string, string>;
  };
  children: ParsedNodeChildren[];
  parent?: ParsedNode;
}

export interface ParsedStringNode {
  text: string;
  parent?: ParsedNode;
}

const EVERY_FRAME = Symbol.for("EVERY_FRAME");

export interface EveryFrameHook {
  [EVERY_FRAME]: true;
  compute: (props: { scale: number; distance: number }) => ParsedElement | null;
}

export type ParsedElement = ParsedNode | ParsedStringNode;
export type ParsedNodeChildren = ParsedElement | EveryFrameHook;
