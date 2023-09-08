import { CharacterPed } from "@/core/utility/character-ped";
import { CharacterCreationCamera } from "./camera";

export function cleanupCharacterCreationScene() {
  CharacterCreationCamera.destroy();
  CharacterPed.destroy();
}
