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
  distance: number;
  zIndex: number;
  isVisible: boolean;
}

export interface ElementRegistration<T extends AnchorType> {
  key: string;
  renderDistance: number;
  anchorType: T;
  render(props: {
    entity: AnchorEntityMap[T];
    scale: number;
  }): ParsedElement | null;
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
