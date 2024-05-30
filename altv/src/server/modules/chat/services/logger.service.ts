import { log, logWarning, logError, Resource } from "@altv/server";
import { bind } from "@shared/decorators";

@bind()
export class LoggerService {
  public log(message: string) {
    log(`[${Resource.current.name}] ${message}`);
  }

  public warn(message: string) {
    logWarning(`[${Resource.current.name}] ${message}`);
  }

  public error(message: string) {
    logError(`[${Resource.current.name}] ${message}`);
  }
}
