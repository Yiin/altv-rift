import * as alt from "@altv/server";
import type { CommandSuggestion } from "@shared/modules/chat";
import { bind } from "@shared/decorators";
import { validateCommandName, validateCommandSuggestion } from "../validators";
import type { CommandHandler } from "../types";

@bind()
export class CommandService {
  private handlers = new Map<string, CommandHandler>();

  public register(command: string, handler: CommandHandler) {
    if (!validateCommandName(command)) return;
    this.handlers.set(command, handler);
  }

  public unregister(command: string) {
    return this.handlers.delete(command);
  }

  public invoke(player: alt.Player, command: string, args: string[]) {
    command = command.toLowerCase();
    const handler = this.handlers.get(command);
    if (!handler) return false;
    handler(player, args);
    return true;
  }

  public addSuggestion(
    player: alt.Player,
    suggestion: CommandSuggestion | Array<CommandSuggestion>
  ) {
    if (!Array.isArray(suggestion)) suggestion = [suggestion];
    const result = suggestion.some((s) => validateCommandSuggestion(s));
    if (!result) return;
    return () => player.emit("vchat:addSuggestion", suggestion);
  }

  public removeSuggestions(player: alt.Player) {
    return () => player.emit("vchat:removeSuggestions");
  }
}
