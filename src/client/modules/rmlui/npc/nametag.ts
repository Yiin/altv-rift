import alt from "alt-client";
import { document, registerElement } from "./elements";

alt.RmlElement.prototype.shown = false;

registerElement({
  key: "nametag",
  renderDistance: 25,
  create(ped) {
    const nametagWrapper = document.createElement("div");
    nametagWrapper.ped = ped;
    nametagWrapper.addClass("nametag-wrapper");
    nametagWrapper.addClass("hide");

    const nametag = document.createElement("span");
    nametag.addClass("nametag");

    alt.setTimeout(() => {
      if (!nametag.valid) {
        return;
      }

      nametag.innerRML =
        (ped.getStreamSyncedMeta("Name") as string) ??
        `Unknown person ${ped.id}`;
    }, 1000);

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
