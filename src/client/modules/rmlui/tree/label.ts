import alt from "alt-client";
import { getTreeLevel, getTreeName } from "@shared/modules/woodcutting";
import { getLevel } from "@shared/modules/experience/experience-table";
import { playerStore } from "@/store/player.store";
import { br, div } from "../renderer/rml-tags";
import { AnchorType } from "../renderer/anchors";
import { registerElement } from "../renderer/element-registry";

registerElement({
  key: "treename",
  renderDistance: 6,
  anchorType: AnchorType.Tree,
  context: {
    updateContext({ entity: tree }) {
      const type = tree.getStreamSyncedMeta("treeType");
      return { type, name: getTreeName(type), level: getTreeLevel(type) };
    },
  },
  render({ entity: tree, scale }, { name, level }) {
    const { x: screenX, y: screenY } = alt.worldToScreen(tree.pos.x, tree.pos.y, tree.pos.z);

    const isUnavailable =
      getLevel(playerStore.character?.skills.woodcutting.experience ?? 0) < level;
    const isOnCooldown = (tree.getStreamSyncedMeta("cooldownUntil") ?? 0) > Date.now();

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
              color: isUnavailable ? "gray" : isOnCooldown ? "silver" : "green",
              transform: `scale(${scale})`,
            },
          },
          [div([`${name} (${tree.remoteId})`]), br([]), div([`Level ${level}`])]
        ),
      ]
    );
  },
});
