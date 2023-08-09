import alt from "alt-client";
import { AnchorEntityMap, AnchorType } from "./anchors";

declare module "alt-client" {
  interface RmlElement {
    entity: AnchorEntity;
    shown: boolean;
    key: string;
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
  focusable?: boolean;
  context?: {
    shouldUpdateContext?(props: { entity: AnchorEntityMap[T] }): boolean;
    updateContext(props: { entity: AnchorEntityMap[T] }): X;
  };
  render(
    props: {
      entity: AnchorEntityMap[T];
      scale: number;
      distance: number;
    } & FrameData,
    context: X
  ): ParsedElement | null;
}

export interface ParsedNode {
  tagName: string;
  classNames: string[];
  props: Record<string, any> & {
    style?: Record<string, string>;
  };
  children: ParsedElement[];
  parent?: ParsedNode;
}

export interface ParsedStringNode {
  text: string;
  parent?: ParsedNode;
}

export type ParsedElement = ParsedNode | ParsedStringNode;
