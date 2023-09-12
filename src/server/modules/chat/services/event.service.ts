import * as alt from "@altv/server";
import { bind } from "@shared/decorators";

@bind()
export class EventService {
  public on(eventName: string, listener: (...args: any[]) => void) {
    return alt.Events.on(eventName, listener);
  }

  public onPlayer(eventName: string, listener: (...args: any[]) => void) {
    return alt.Events.onPlayer(eventName, listener);
  }

  public emitClient(player: alt.Player, eventName: string, ...args: any[]) {
    player.emit(eventName, ...args);
  }
}
