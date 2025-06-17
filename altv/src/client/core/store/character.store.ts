import alt from "@altv/client";
import { ref } from "@yiin/reactive-proxy-state";
import { ClientEvents } from "@shared/events/client";
import { WebviewEvents } from "@shared/events/webview";
import { Character } from "@shared/interfaces";
import { useWebview } from "@/core/user-interface/webview";
import { reactive, updateState } from "@yiin/reactive-proxy-state";

let characterState: Character | null = null;

export const isCharacterStoreAvailable = ref(false);

alt.Events.onServer(ClientEvents.FromServer.UPDATE_CHARACTER_STATE, (event: any) => {
  useWebview((webview) => webview.emitRaw(WebviewEvents.FromClient.UPDATE_CHARACTER_STATE, event));

  if (!characterState) {
    const character = {} as Character;
    updateState(character, event);
    characterState = reactive(character as Character);
    isCharacterStoreAvailable.value = true;
  } else {
    updateState(characterState, event);
  }
});

export function useCharacter() {
  if (!characterState) {
    throw new Error("Character store is not ready.");
  }
  return characterState;
}
