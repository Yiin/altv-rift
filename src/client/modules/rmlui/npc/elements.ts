import alt from "alt-client";
import { join } from "@shared/utility/path";
import { ParsedElement } from "../renderer/types";
import { createRenderer } from "../renderer/rml-renderer";

export enum AnchorType {
  Ped,
  Player,
  Vehicle,
}

type AnchorProps = {
  [AnchorType.Ped]: {
    ped: alt.Ped;
  };
  [AnchorType.Player]: {
    player: alt.Player;
  };
  [AnchorType.Vehicle]: {
    vehicle: alt.Vehicle;
  };
};

export interface ElementRegistration<T extends AnchorType> {
  key: string;
  renderDistance: number;
  anchorType: T;
  render(
    props: AnchorProps[T] & {
      scale: number;
    }
  ): ParsedElement;
}

alt.RmlElement.prototype.shown = false;

export const document = new alt.RmlDocument(join(__relativedirname, "npc.rml"));
// We're storing the container for further usage, e.g. adding and removing elements
export const container = document.getElementByID("container")!;
// We use a map to simplify the mapping of entity and RmlElement
export const elements: Map<alt.Ped, Map<string, alt.RmlElement>> = new Map();

export const renderer = createRenderer(document);

export const registeredElements = new Map<
  string,
  ElementRegistration<AnchorType>
>();

export const registerElement = <T extends AnchorType>(
  registration: ElementRegistration<T>
) => {
  registeredElements.set(registration.key, registration);
};
