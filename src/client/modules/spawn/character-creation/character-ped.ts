import alt from "@altv/client";
import { PedAppearance } from "@/core/utility/ped-appearance";
import { setupPeacefulPed } from "@/modules/peds/setup-ped/setup-peaceful-ped";
import { Appearance } from "@prisma/client/edge";

let isHidden = false;
let ped: alt.LocalPed | undefined;

export function getCharacterCreationPed() {
  return ped;
}

export async function createCharacterPed(isMale: boolean, pos: alt.IVector3, heading: number = 0) {
  isHidden = false;

  alt.log("Destroying ped");
  if (ped) {
    ped.destroy();
    await alt.Utils.wait(100);
  }

  const model = isMale ? "mp_m_freemode_01" : "mp_f_freemode_01";

  alt.log(`Creating ped on ${pos.x}, ${pos.y}, ${pos.z} @ dimension ${alt.Player.local.dimension}`);

  ped = alt.LocalPed.create({
    model: alt.hash(model),
    pos: new alt.Vector3(pos),
    heading,
    dimension: -2147483648,
    useStreaming: false,
  });

  alt.log("Waiting for ped to spawn");

  alt.Timers.setInterval(() => {
    if (!ped) return;

    if (ped.scriptID) {
      alt.log("Ped is streamed in");
    } else {
      alt.log(
        ped.scriptID,
        ped.pos.distanceTo(alt.Player.local.pos),
        ped.dimension,
        alt.Player.local.dimension
      );
    }
  }, 1000);

  return await new Promise<alt.LocalPed>(async (resolve) => {
    await ped?.waitForSpawn();

    if (ped && ped.scriptID) {
      setupPeacefulPed(ped);
      PedAppearance.applyEquipment(ped.scriptID, [], isMale);

      resolve(ped);
      return;
    } else {
      alt.log("Ped is not streamed in yet, waiting for game entity create event");
    }

    const handler = alt.Events.onGameEntityCreate(({ entity }) => {
      alt.log("Game entity created", entity.constructor.name);
      if (entity === ped) {
        handler.destroy();

        alt.log("Ped Created");

        setupPeacefulPed(ped);
        PedAppearance.applyEquipment(ped.scriptID, [], isMale);

        resolve(ped);
      }
    });
  });
}

alt.Events.onGameEntityDestroy(({ entity }) => {
  if (entity === ped) {
    ped = undefined;
  }
});

let lastAppearance: Appearance | undefined;
let currentlyUpdating = false;
let nextAppearance: Appearance | undefined;

export async function updateAppearance(newAppearance: Appearance): Promise<void> {
  if (!ped) {
    return;
  }

  alt.log("Updating appearance");

  await ped.waitForSpawn();

  if (currentlyUpdating) {
    alt.log("still updating");
    nextAppearance = newAppearance;
    return;
  }

  currentlyUpdating = true;

  if (!lastAppearance || (lastAppearance && lastAppearance.sex !== newAppearance.sex)) {
    const { pos, rot } = ped;
    await createCharacterPed(newAppearance.sex === 0, pos, rot.z);
  }

  await PedAppearance.applyAppearance(ped.scriptID, newAppearance);
  lastAppearance = newAppearance;

  currentlyUpdating = false;

  if (nextAppearance) {
    const next = nextAppearance;
    nextAppearance = undefined;
    await updateAppearance(next);
  }
}
