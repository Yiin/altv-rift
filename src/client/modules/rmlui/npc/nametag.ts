import alt from "alt-client";
import { NpcID } from "@shared/modules/npc/types";
import { document, registerElement } from "./elements";

declare module "alt-client" {
  interface RmlElement {
    npcId: NpcID;
    shown: boolean;
  }
}

alt.RmlElement.prototype.shown = false;

registerElement({
  key: "nametag",
  renderDistance: 25,
  create(streamedInNpc) {
    const npcId = streamedInNpc.npc.id;

    const nametagWrapper = document.createElement("div");
    nametagWrapper.npcId = npcId;
    nametagWrapper.addClass("nametag-wrapper");
    nametagWrapper.addClass("hide");

    const nametag = document.createElement("span");
    nametag.addClass("nametag");
    nametag.innerRML = streamedInNpc.npc.meta.name ?? `Unknown person ${npcId}`;

    nametagWrapper.appendChild(nametag);

    return nametagWrapper;
  },
  update(element, { pedPos, camDistToPed, scale }) {
    const { x: screenX, y: screenY } = alt.worldToScreen(
      pedPos.x,
      pedPos.y,
      pedPos.z + Math.min((camDistToPed / 4) * 0.5 + 0.2, 0.5)
    );

    element.style[
      "transform"
    ] = `translate(-50%, -50%) translate(${screenX}px, ${screenY}px)`;

    const [nametag] = element.getElementsByClassName("nametag")!;
    nametag.style["transform"] = `scale(${scale})`;
  },
});
