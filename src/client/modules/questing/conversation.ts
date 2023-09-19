import alt from "alt-client";
import game from "natives";
import { ConversationOption } from "@shared/interfaces/conversation";
import { ServerEvents } from "@shared/events/server";
import { Control, ControlType } from "@/core/constants/controls";
import { clientState } from "@/core/store/client.store";

interface ConversationInfo {
  pages: string[];
  topic?: string;
  options?: ConversationOption[];
}

const EMOTIONS = {
  "(Laughs)": ["missheistdockssetup1ig_10@laugh", "laugh_pipe_worker3"],
};

let currentPage = 0;
let promise: {
  resolve: ((option?: ConversationOption) => void) | null;
} | null = null;

export function isInConversation() {
  return clientState.conversation !== null;
}

export function stopConversation(option?: ConversationOption) {
  alt.nextTick(() => {
    currentPage = 0;
    clientState.conversation = null;
  });
  if (promise) {
    promise.resolve?.(option);
    promise = null;
  }
}

export async function startConversation(
  ped: alt.Ped,
  { pages, topic, options: finalOptions }: ConversationInfo
) {
  currentPage = 0;

  alt.emitServer(ServerEvents.FromClient.CONVERSATION_STARTED, ped.remoteID);
  // game.taskTurnPedToFaceEntity(ped.scriptID, alt.Player.local.scriptID, 2000);

  clientState.conversation = {
    with: ped.getStreamSyncedMeta("name") ?? "?",
    pages,
    topic,
    finalOptions,
    currentPage,
    options: [],
    selectedOption: 0,
  };

  updateConversation();

  return new Promise<ConversationOption | undefined>((resolve) => {
    promise = { resolve };
  });
}

function updateConversation() {
  const conversation = clientState.conversation;

  if (!conversation) {
    return;
  }

  const options = (() => {
    if (currentPage < conversation.pages.length - 1) {
      return [
        {
          type: "next",
          label: "Next",
        } as const,
      ];
    }

    if (conversation.finalOptions) {
      return conversation.finalOptions;
    }

    return [
      {
        type: "next",
        label: "End",
      } as const,
    ];
  })();

  conversation.options = options;
  conversation.currentPage = currentPage;
}

function selectPreviousOption() {
  if (!isInConversation() || !clientState.conversation) {
    return;
  }
  if (--clientState.conversation.selectedOption < 0) {
    clientState.conversation.selectedOption = clientState.conversation.options.length - 1;
  }
  if (clientState.conversation.options.length > 1) {
    game.playSoundFrontend(-1, "NAV_UP_DOWN", "HUD_FREEMODE_SOUNDSET", true);
  }
}

function selectNextOption() {
  if (!isInConversation || !clientState.conversation) {
    return;
  }
  if (++clientState.conversation.selectedOption >= clientState.conversation.options.length) {
    clientState.conversation.selectedOption = 0;
  }
  if (clientState.conversation.options.length > 1) {
    game.playSoundFrontend(-1, "NAV_UP_DOWN", "HUD_FREEMODE_SOUNDSET", true);
  }
}

function confirmOption() {
  if (!clientState.conversation) {
    return;
  }

  const conversation = clientState.conversation;

  const option = conversation.options[conversation.selectedOption];

  if (++currentPage < conversation.pages.length) {
    updateConversation();
  } else {
    stopConversation(option);
  }
}

alt.everyTick(() => {
  if (!isInConversation()) {
    return;
  }

  game.disablePlayerFiring(alt.Player.local, false);
  game.disableControlAction(ControlType.PLAYER_CONTROL, Control.INPUT_ATTACK, true);
  game.disableControlAction(ControlType.PLAYER_CONTROL, Control.INPUT_WEAPON_WHEEL_PREV, true);
  game.disableControlAction(ControlType.PLAYER_CONTROL, Control.INPUT_WEAPON_WHEEL_NEXT, true);

  if (
    game.isDisabledControlJustPressed(ControlType.PLAYER_CONTROL, Control.INPUT_WEAPON_WHEEL_PREV)
  ) {
    selectPreviousOption();
  } else if (
    game.isDisabledControlJustPressed(ControlType.PLAYER_CONTROL, Control.INPUT_WEAPON_WHEEL_NEXT)
  ) {
    selectNextOption();
  } else if (game.isDisabledControlJustPressed(ControlType.PLAYER_CONTROL, Control.INPUT_ATTACK)) {
    confirmOption();
    game.playSoundFrontend(-1, "SELECT", "HUD_FREEMODE_SOUNDSET", true);
  }
});
