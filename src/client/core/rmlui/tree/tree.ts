import alt from "alt-client";
import { getLevel } from "@shared/modules/experience/experience-table";
import { getTreeLevel, getTreeName } from "@shared/modules/woodcutting";
import { useCharacter } from "@/store/character.store";
import { br, div } from "../renderer/rml-tags";
import { AnchorType } from "../renderer/anchors";
import { registerElement } from "../renderer/element-registry";
import { everyFrame } from "../renderer/hooks/every-frame";

registerElement({
  key: "treename",
  renderDistance: 6,
  anchorType: AnchorType.Tree,
  render({ entity: tree }) {
    const character = useCharacter();
    const type = tree.getStreamSyncedMeta("treeType");
    const name = getTreeName(type);
    const level = getTreeLevel(type);
    const isUnavailable = getLevel(character.skills.woodcutting.experience ?? 0) < level;
    const isOnCooldown = (tree.getStreamSyncedMeta("cooldownUntil") ?? 0) > Date.now();

    const transform = everyFrame(() => {
      const { x: screenX, y: screenY } = alt.worldToScreen(tree.pos.x, tree.pos.y, tree.pos.z);
      return `translate(-50%, -50%) translate(${screenX}px, ${screenY}px)`;
    });

    const scale = everyFrame(({ scale }) => `scale(${scale})`);

    return div(
      {
        className: "tree-wrapper",
        style: {
          transform,
        },
      },
      [
        div(
          {
            className: "tree",
            style: {
              color: isUnavailable ? "gray" : isOnCooldown ? "silver" : "green",
              transform: scale,
            },
          },
          [div([`${name} (${tree.remoteId})`]), br([]), div([`Level ${level}`])]
        ),
      ]
    );
  },
});
