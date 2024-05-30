import type { Player } from "@altv/server";

export type CommandHandler = (player: Player, args: Array<string>) => void;
