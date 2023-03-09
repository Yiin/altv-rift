import { defineStore } from "pinia";
import { Character } from "@shared/interfaces";
import { Npc } from "@shared/modules/npc/npc";

interface PlayerData {
  user: LoadedUser;
  character: Character;
  avgPing: number;
  sync: {
    npc: {
      streamedIn: Npc[];
      netOwnerOf: Set<Npc["id"]>;
    };
  };
}

type LoggedInPlayer = PlayerData & { isLoggedIn: true };
type LoggedOutPlayer = {
  isLoggedIn: false;
  user: null;
  character: null;
  avgPing: null;
  sync: PlayerData["sync"];
};

type PlayerStoreState = LoggedOutPlayer | LoggedInPlayer;

export const usePlayerStore = defineStore("player", {
  state: (): PlayerStoreState => ({
    isLoggedIn: false,
    user: null,
    character: null,
    avgPing: null,
    sync: {
      npc: {
        streamedIn: [],
        netOwnerOf: new Set(),
      },
    },
  }),
});
