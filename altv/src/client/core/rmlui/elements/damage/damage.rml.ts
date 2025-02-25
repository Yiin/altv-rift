import alt from "@altv/client";
import game from "@altv/natives";
import { ClientEvents } from "@shared/events/client";
import { everyTickWhile } from "@/core/user-interface/event-helpers";
import { PED_CONFIG_FLAG } from "@/core/constants/ped-flags";
import { document } from "../../renderer/element-renderer";

const damageContainer = document.createElement("div");

document.body.appendChild(damageContainer);

function displayHit(
  position: alt.Vector3,
  damage: number,
  type: "health" | "armor" | "explosion",
  ped: alt.Ped,
): void {
  // Create a new div element for damage number
  const damageDiv = document.createElement("div");

  const textNode = document.createTextNode(
    damage < 10
      ? damage.toFixed(2).replace(/0+$/, "").replace(/\.$/, "")
      : Math.round(damage).toFixed(0).toString(),
  );
  damageDiv.appendChild(textNode);

  damageDiv.style.position = "absolute";
  damageDiv.style["font-weight"] = "bold";
  damageDiv.style.color =
    {
      health: "#ff2222",
      armor: "#ffffff",
      explosion: "#ffa500",
    }[type] ?? "#ff2222";
  damageDiv.style["font-size"] = `${Math.min(damage, 20)}pt`;
  damageDiv.style.animation = `1s exponential-out damage-fade-${Math.ceil(Math.random() * 7)}`;

  damageContainer.appendChild(damageDiv);

  const pos = position.add({
    x: Math.random() * 0.1 - 0.05,
    y: Math.random() * 0.1 - 0.05,
    z: Math.random() * 0.1 - 0.05,
  });

  everyTickWhile(
    () => damageDiv.valid,
    () => {
      const { x, y } = alt.worldToScreen(pos);
      damageDiv.style.top = `${y}px`;
      damageDiv.style.left = `${x}px`;
    },
  );

  // Remove the div after the animation is done
  setTimeout(() => {
    damageContainer.removeChild(damageDiv);
    damageDiv.destroy();
  }, 900);
}

declare module "@altv/client" {
  interface Player {
    previousHealth: number;
    damagedBonePos: alt.Vector3;
  }

  interface Ped {
    previousHealth: number;
    damagedBonePos?: alt.Vector3;
  }
}

alt.Timers.everyTick(() => {
  if (!game.hasPlayerDamagedAtLeastOnePed(alt.Player.local)) {
    return;
  }
  for (const ped of alt.Ped.streamedIn) {
    ped.previousHealth ??= ped.streamSyncedMeta.health;

    if (ped.previousHealth <= ped.streamSyncedMeta.health) {
      continue;
    }

    const [wasDamaged, bone] = game.getPedLastDamageBone(ped);

    if (wasDamaged) {
      const bonePos = game.getPedBoneCoords(ped, bone, 0, 0, 0);

      ped.damagedBonePos = bonePos;
    }
  }
});

alt.Events.onServer(
  ClientEvents.FromServer.DISPLAY_DAMAGE_HIT,
  (entityType, entityRemoteID, damage, type) => {
    switch (entityType) {
      case alt.Enums.BaseObjectType.PED: {
        const ped = alt.Ped.getByRemoteID(entityRemoteID);

        if (ped) {
          displayHit(ped.damagedBonePos ?? ped.pos, damage, type, ped);
          ped.damagedBonePos = undefined;
        } else {
          alt.log(`[damage ui]: No ped found for remoteID: ${entityRemoteID}`);
        }
        break;
      }
    }
  },
);
