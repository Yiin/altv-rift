type ConsoleCommand = {
  [cmd: string]: (...args: string[]) => void;
};

const Commands: ConsoleCommand = {};

/**
 * Invokes a callback for the specific console command.
 */
function handleConsoleMessage(cmdName: string, ...args: string[]): void {
  const cmdNameclean = cmdName.replace(/^\s+|\s+$/g, "");

  if (Commands[cmdNameclean]) {
    Commands[cmdNameclean]!(...args);
  } else {
    console.log(`Command "${cmdNameclean}" not found.`);
  }
}

export class ConsoleCommander {
  static init(alt: { on: (event: string, handler: Function) => any }) {
    alt.on("consoleCommand", handleConsoleMessage);
  }

  /**
   * Allows a console command to be invoked through other means.
   */
  static invokeCommand(cmdName: string, ...args: string[]): void {
    handleConsoleMessage(cmdName, ...args);
  }

  /**
   * Register a Server-Side or Client-Side Console Command
   * Depends on the folder you are writing inside of.
   */
  static registerConsoleCommand(
    cmdName: string,
    callback: (...args: string[]) => void
  ) {
    Commands[cmdName] = callback;
  }

  /**
   * Return a list of commands...
   */
  static getCommands() {
    return Object.keys(Commands);
  }
}
