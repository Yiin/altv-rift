import { defineStore } from "pinia";
import { Character } from "@shared/interfaces";

interface PlayerData {
  user: LoadedUser;
  character: Character;
  avgPing: number;
}

type LoggedInPlayer = PlayerData & { isLoggedIn: true };
type LoggedOutPlayer = {
  isLoggedIn: false;
  user: null;
  character: null;
  avgPing: null;
};

type PlayerStoreState = LoggedOutPlayer | LoggedInPlayer;

export const usePlayerStore = defineStore("player", {
  state: (): PlayerStoreState => ({
    isLoggedIn: false,
    user: null,
    character: null,
    avgPing: null,
  }),
});
