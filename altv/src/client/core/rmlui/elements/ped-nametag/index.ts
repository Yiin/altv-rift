import alt from "@altv/client";
import game from "@altv/natives";
import { PedBone } from "@shared/enums/bones";
import { PedFlags } from "@shared/modules/ped";
import { div } from "../../renderer/rml-tags";
import { AnchorType } from "../../renderer/anchors";
import { registerElement } from "../../renderer/element-registry";
import { everyFrame } from "../../renderer/hooks/every-frame";
import { isQuestPed } from "@/modules/peds/lib/is-quest-ped";
import { QuestNametag } from "./quest/quest-nametag";
import { px, rem } from "../../renderer/pixel";
import { EnemyNametag } from "./enemy/enemy-nametag";
import { isShopPed } from "@/modules/peds/lib/is-shop-ped";
import { ShopNametag } from "./shop/shop-nametag";


registerElement({
  key: "ped-nametag",
  renderDistance: 40,
  anchorType: AnchorType.Ped,
  render({ entity: ped }) {
    const name = ped.streamSyncedMeta.name;
    const flags = ped.streamSyncedMeta.flags ?? 0;
    const isEnemy = !(flags & PedFlags.Peaceful);
    const isQuest = isQuestPed(ped);
    const isShop = isShopPed(ped);

    return div(
      { class: "pedNameTagContainer" },
      [
        div(
          {
            class: "pedNameTag",
            style: {
              transform: everyFrame(() => {
                const headPos = game.getPedBoneCoords(
                  ped,
                  PedBone.SKEL_Head,
                  0.4, 0, 0
                );
                const { x, y } = alt.worldToScreen({ x: ped.pos.x, y: ped.pos.y, z: headPos.z });

                // 100 and 300 are values from .ped-nametag width & height
                // x - width / 2
                // y - height
                return `translate(${x - px(100)}px, ${y - px(300)}px)`;
              }),
            },
          },
          [
            div(
              {
                class: "pedNameTagContent",
                style: {
                  transform: everyFrame(({ scale }) => `scale(${scale})`),
                },
              },
              [
                isQuest
                  ? QuestNametag(ped)
                  : isEnemy
                    ? EnemyNametag(ped)
                    : isShop
                    ? ShopNametag(ped)
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
