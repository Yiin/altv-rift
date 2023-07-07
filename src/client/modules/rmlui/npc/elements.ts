import alt from "alt-client";
import { join } from "@shared/utility/path";

interface ElementRegistration {
  key: string;
  renderDistance: number;
  create(streamedInNpc: alt.Ped): alt.RmlElement | undefined;
  update(
    element: alt.RmlElement,
    info: {
      pedPos: alt.Vector3;
      camPos: alt.Vector3;
      camDistToPed: number;
      scale: number;
    }
  ): void;
}

alt.RmlElement.prototype.shown = false;

export const document = new alt.RmlDocument(join(__relativedirname, "npc.rml"));
// We're storing the container for further usage, e.g. adding and removing elements
export const container = document.getElementByID("container")!;
// We use a map to simplify the mapping of entity and RmlElement
export const elements: Map<alt.Ped, Map<string, alt.RmlElement>> = new Map();

export const registeredElements: ElementRegistration[] = [];

export const registerElement = (registration: ElementRegistration) => {
  registeredElements.push(registration);
};
