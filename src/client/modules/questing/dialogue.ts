import alt from "alt-client";
import game from "natives";
import { ConversationOption } from "@shared/interfaces/conversation";
import { Control, ControlType } from "@/constants/controls";
import { clientStore } from "@/store/client.store";

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
  return clientStore.conversation !== null;
}

export function stopConversation(option?: ConversationOption) {
  alt.nextTick(() => {
    currentPage = 0;
    clientStore.conversation = null;
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

  clientStore.conversation = {
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
  const conversation = clientStore.conversation;

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
  if (!isInConversation() || !clientStore.conversation) {
    return;
  }
  if (--clientStore.conversation.selectedOption < 0) {
    clientStore.conversation.selectedOption =
      clientStore.conversation.options.length - 1;
  }
  if (clientStore.conversation.options.length > 1) {
    game.playSoundFrontend(-1, "NAV_UP_DOWN", "HUD_FREEMODE_SOUNDSET", true);
  }
}

function selectNextOption() {
  if (!isInConversation || !clientStore.conversation) {
    return;
  }
  if (
    ++clientStore.conversation.selectedOption >=
    clientStore.conversation.options.length
  ) {
    clientStore.conversation.selectedOption = 0;
  }
  if (clientStore.conversation.options.length > 1) {
    game.playSoundFrontend(-1, "NAV_UP_DOWN", "HUD_FREEMODE_SOUNDSET", true);
  }
}

function confirmOption() {
  if (!clientStore.conversation) {
    return;
  }

  const conversation = clientStore.conversation;

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

  game.disableControlAction(
    ControlType.PLAYER_CONTROL,
    Control.INPUT_ATTACK,
    true
  );

  if (
    game.isControlJustPressed(
      ControlType.PLAYER_CONTROL,
      Control.INPUT_WEAPON_WHEEL_PREV
    )
  ) {
    selectPreviousOption();
  } else if (
    game.isControlJustPressed(
      ControlType.PLAYER_CONTROL,
      Control.INPUT_WEAPON_WHEEL_NEXT
    )
  ) {
    selectNextOption();
  } else if (
    game.isDisabledControlJustPressed(
      ControlType.PLAYER_CONTROL,
      Control.INPUT_ATTACK
    )
  ) {
    confirmOption();
    game.playSoundFrontend(-1, "SELECT", "HUD_FREEMODE_SOUNDSET", true);
  }
});
