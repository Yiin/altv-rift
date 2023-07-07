import alt, { Player } from "alt-server";
import { Npc } from "@shared/modules/streamed-npc/npc";

type DialogEntry = {
  from: string;
  message: string | string[];
  action?: string;
};

type Dialogue = {
  key: string;
  entries: DialogEntry[];
  characters: Record<string, Npc>;
};

const EMOTIONS = {
  "(Laughs)": ["missheistdockssetup1ig_10@laugh", "laugh_pipe_worker3"],
};

const dialogues = new Map<string, Dialogue>();

export function createDialog(
  key: string,
  dialogEntries: DialogEntry[],
  characters: Record<string, Npc>
) {
  dialogues.set(key, { key, entries: dialogEntries, characters });
}

const activeDialogues = new Map<
  Player["id"],
  {
    key: string;
    lastIndex: number;
    selectedOption?: number;
  }
>();

alt.onClient("dialogue:start", (player: Player, key: string) => {
  activeDialogues.set(player.id, { key, lastIndex: 0 });
});

alt.onClient(
  "dialogue:next",
  (player: Player, key: string, option?: number) => {
    const dialogue = dialogues.get(key);
    if (!dialogue) return;

    const activeDialogue = activeDialogues.get(player.id);
    if (!activeDialogue) return;

    if (activeDialogue.key !== key) return;

    const entry = dialogue.entries[activeDialogue.lastIndex];
    if (!entry) return;

    const nextEntry = dialogue.entries[activeDialogue.lastIndex + 1];
    if (!nextEntry) return;

    const from =
      nextEntry.from === "player"
        ? player
        : dialogue.characters[nextEntry.from];
    if (!from) return;

    const message = nextEntry.message;

    if (typeof message === "string") {
      const emotion = EMOTIONS[message];
      if (emotion) {
        from.playAnimation(emotion[0], emotion[1], 1, 0, -1, 0, 0, false);
      }
    }

    player.emit("dialogue:next", nextEntry, activeDialogue.selectedOption);
  }
);

alt.onClient("dialogue:cancel", (player: Player) => {
  activeDialogues.delete(player.id);
});
