import alt from "alt-client";
import { playerStore } from "@/store/player.store";

alt.on("spawned", () => {
  alt.log(playerStore.$state.character?.inventory, playerStore.$state.avgPing);
});
