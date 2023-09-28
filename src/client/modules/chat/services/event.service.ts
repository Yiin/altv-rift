import * as alt from "@altv/client";
import { bind } from "@shared/decorators";

@bind()
export class EventService {
  public emitServerRaw(event: string, ...args: any[]) {
    alt.Events.emitServerRaw(event, ...args);
  }

  public onServer(event: string, listener: (...args: any[]) => void) {
    alt.Events.onServer(event, listener);
  }

  public on(event: string, listener: (...args: any[]) => void) {
    alt.Events.on(event, listener);
  }
}
