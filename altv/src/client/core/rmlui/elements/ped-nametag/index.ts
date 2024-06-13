import alt from "@altv/client";
import game from "@altv/natives";
import { Bones } from "@shared/enums/bones";
import { PedFlags } from "@shared/modules/ped";
import { div } from "../../renderer/rml-tags";
import { AnchorType } from "../../renderer/anchors";
import { registerElement } from "../../renderer/element-registry";
import { everyFrame } from "../../renderer/hooks/every-frame";
import { isQuestPed } from "@/modules/peds/lib/is-quest-ped";
import { QuestNametag } from "./quest-nametag";
import { px, rem } from "../../renderer/pixel";
import { EnemyNametag } from "./enemy-nametag";


registerElement({
  key: "ped-nametag",
  renderDistance: 40,
  anchorType: AnchorType.Ped,
  render({ entity: ped }) {
    const name = ped.streamSyncedMeta.name;
    const flags = ped.streamSyncedMeta.flags ?? 0;
    const isEnemy = !(flags & PedFlags.Peaceful);
    const isQuest = isQuestPed(ped);

    return div({
      style: {
        position: "absolute",
      }
    }, [
      div(
        {
          style: {
            "text-align": "center",
            "transform-origin": "center bottom 0px",
            width: rem(200),
            height: rem(300),
            display: "flex",
            "flex-direction": "column",
            "justify-content": "flex-end",
            "align-items": "center",
            transform: everyFrame(() => {
              const headPos = game.getPedBoneCoords(
                ped,
                Bones.SKEL_Head,
                // adjust z position based on distance
                0.4,
                0,
                0,
              );
              const { x, y } = alt.worldToScreen({ x: ped.pos.x, y: ped.pos.y, z: headPos.z });

              return `translate(${x - px(100)}px, ${y - px(300)}px)`;
            }),
          },
        },
        [
          div(
            {
              style: {
                "transform-origin": "center bottom",
                transform: everyFrame(({ scale }) => `scale(${scale})`),
              },
            },
            [
              isQuest
                ? QuestNametag(ped)
                : isEnemy
                  ? EnemyNametag(ped)
                  : div({
                    class: "questNameTagContainer"
                  }, [
                    div({
                      class: "questNameTagName"
                    }, [name]),
                  ]),
            ],
          ),
        ],
      )
    ]);
  },
});
