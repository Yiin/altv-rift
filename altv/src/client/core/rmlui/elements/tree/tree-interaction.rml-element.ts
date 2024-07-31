import alt from "@altv/client";
import game from "@altv/natives";
import { getLevel } from "@shared/modules/experience/experience-table";
import { getTreeLevel, getTreeName } from "@shared/modules/woodcutting";
import { useCharacter } from "@/core/store/character.store";
import { br, div } from "../../renderer/rml-tags";
import { AnchorType } from "../../renderer/anchors";
import { registerElement } from "../../renderer/element-registry";
import { everyFrame } from "../../renderer/hooks/every-frame";
import { rem } from "../../renderer/pixel";
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
        class: "tree-wrapper",
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
            class: "tree",
            style: {
              color: isUnavailable ? "gray" : isOnCooldown ? "silver" : "white",
              "text-align": "left",
            },
          },
          [
            div({ style: { position: "absolute", transform: `translate(${rem(-30)}, ${rem(-25)})` } }, [
              isUnavailable || isOnCooldown ? Icon("axe-cooldown") : Icon("axe"),
            ]),
            div({ style: { "text-align": "left", width: rem(400) } }, [
              div({ style: { "font-size": rem(10), "margin-top": rem(-20), "margin-left": rem(30) } }, [
                isUnavailable ? "Level too low" : isOnCooldown ? "On cooldown" : "Ready to cut",
              ]),
              br([]),
              div([name]),
              br([]),
              div({ style: { "font-size": rem(12) } }, [`Level ${level}`]),
            ]),
          ],
        ),
      ],
    );
  },
});
