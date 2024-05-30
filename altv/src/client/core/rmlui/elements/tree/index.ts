import alt from "@altv/client";
import game from "@altv/natives";
import { getLevel } from "@shared/modules/experience/experience-table";
import { getTreeLevel, getTreeName } from "@shared/modules/woodcutting";
import { useCharacter } from "@/core/store/character.store";
import { br, div } from "../../renderer/rml-tags";
import { AnchorType } from "../../renderer/anchors";
import { registerElement } from "../../renderer/element-registry";
import { everyFrame } from "../../renderer/hooks/every-frame";
import { Icon } from "../../components/icon";

registerElement({
  key: "treename",
  renderDistance: 5,
  anchorType: AnchorType.Tree,
  render({ entity: tree }) {
    const character = useCharacter();
    const type = tree.streamSyncedMeta.treeType;
    const name = getTreeName(type);
    const level = getTreeLevel(type);
    const isUnavailable = getLevel(character.skills.woodcutting) < level;
    const isOnCooldown = (tree.streamSyncedMeta.cooldownUntil ?? 0) > Date.now();

    return div(
      {
        className: "tree-wrapper",
        style: {
          transform: everyFrame(() => {
            const { x, y } = alt.worldToScreen(tree.pos);
            return `translate(-50%, -50%) translate(${x}px, ${y}px)`;
          }),
        }, //
      },
      [
        div(
          {
            className: "tree",
            style: {
              color: isUnavailable ? "gray" : isOnCooldown ? "silver" : "white",
              "text-align": "left",
            },
          },
          [
            div({ style: { position: "absolute", transform: "translate(-30px, -25px)" } }, [
              isUnavailable || isOnCooldown ? Icon("axe-cooldown") : Icon("axe"),
            ]),
            div({ style: { "text-align": "left", width: "400px" } }, [
              div({ style: { "font-size": "9pt", "margin-top": "-20px", "margin-left": "30px" } }, [
                isUnavailable ? "Level too low" : isOnCooldown ? "On cooldown" : "Ready to cut",
              ]),
              br([]),
              div([name]),
              br([]),
              div({ style: { "font-size": "10pt" } }, [`Level ${level}`]),
            ]),
          ],
        ),
      ],
    );
  },
});
