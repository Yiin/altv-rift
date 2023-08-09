import alt from "alt-client";
import game from "natives";
import { br, div } from "../renderer/rml-tags";
import { AnchorType } from "../renderer/anchors";
import { registerElement } from "../renderer/element-registry";

registerElement({
  key: "treename",
  renderDistance: 20,
  anchorType: AnchorType.Tree,
  render({ entity: tree, scale }) {
    const nametag = tree.type;

    const { x: screenX, y: screenY } = alt.worldToScreen(tree.pos.x, tree.pos.y, tree.pos.z + 2);

    return div(
      {
        className: "nametag-wrapper",
        style: {
          transform: `translate(-50%, -50%) translate(${screenX}px, ${screenY}px)`,
        },
      },
      [
        div(
          {
            className: "nametag",
            style: {
              transform: `scale(${scale})`,
            },
          },
          [div([nametag]), br([]), div([game.getSequenceProgress(alt.Player.local.scriptID)])]
        ),
      ]
    );
  },
});
