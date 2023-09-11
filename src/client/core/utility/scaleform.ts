import alt from "@altv/client";
import game from "@altv/natives";

export class Scaleform {
  private id: number;

  constructor(hash: number) {
    this.id = hash;
  }

  hasLoaded(): boolean {
    return game.hasScaleformMovieLoaded(this.id);
  }

  passFunction(functionName: string, ...args: any[]) {
    game.beginScaleformMovieMethod(this.id, functionName);

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];

      switch (typeof arg) {
        case "number": {
          if (Number(arg) === arg && arg % 1 !== 0) {
            game.scaleformMovieMethodAddParamFloat(arg);
          } else {
            game.scaleformMovieMethodAddParamInt(arg);
          }
        }

        case "string": {
          game.scaleformMovieMethodAddParamPlayerNameString(arg as string);
          break;
        }

        case "boolean": {
          game.scaleformMovieMethodAddParamBool(arg);
          break;
        }

        default: {
          alt.logError(
            `Bad Argument: ${typeof arg} = ${arg.toString()} passed to scaleform with handle ${this.id
            }`
          );
        }
      }
    }

    return game.endScaleformMovieMethodReturnValue();
  }

  destroy() {
    game.setScaleformMovieAsNoLongerNeeded(this.id);
    this.id = 0;
  }

  render(x: number, y: number, width: number, height: number) {
    game.drawScaleformMovie(this.id, x, y, width, height, 255, 255, 255, 255, 0);
  }
}

export function requestScaleForm(scaleformName: string): Promise<Scaleform> {
  return new Promise((resolve: Function) => {
    const instance = new Scaleform(game.requestScaleformMovie(scaleformName));
    const interval = alt.Timers.setInterval(() => {
      if (!instance.hasLoaded()) {
        return;
      }

      interval.destroy();
      resolve(instance);
    }, 5);
  });
}
