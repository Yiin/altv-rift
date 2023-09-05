import alt from "alt-client";
import { sleep } from "@/utility/sleep";
import { PedAppearance } from "@/utility/ped-appearance";
import { getGroundPos } from "@/utility/get-ground-pos";
import { CharacterPed } from "@/utility/character-ped";
import { CharacterCreationCamera } from "./camera";

const pedPosition = new alt.Vector3(1507.9, -1732.3, 78.65);
const pedRotation = 288;

export async function setupCharacterCreationScene() {
  await sleep(1000);
  const groundPosition = await getGroundPos(pedPosition);

  await CharacterPed.create(true, groundPosition, pedRotation);
  await sleep(200);
  await CharacterPed.setHidden(true);
  await CharacterCreationCamera.create(CharacterPed.get());

  await PedAppearance.applyEquipment(CharacterPed.get());
  await CharacterPed.setHidden(false);
}
