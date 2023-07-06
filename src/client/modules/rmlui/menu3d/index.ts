import alt from "alt-client";
import game from "natives";
import { KeyCode } from "altv-enums";
import { join } from "@shared/utility/path";

export interface OptionFor3DMenu {
  /**
   * The name to display on-screen.
   */
  name: string;

  /**
   * What function to call when this item is selected.
   */
  callback: () => void;
}

const KEYS = {
  ESCAPE_KEY: 27,
  ENTER_KEY: 13,
  LEFT_KEY: 37,
  RIGHT_KEY: 39,
  UP_KEY: 38,
  DOWN_KEY: 40,
};

let maxDistance: number;
let internalPos: alt.IVector3 | undefined;
let internalOptions: Array<OptionFor3DMenu> | undefined;
let optionIndex: number = 0;
let document: alt.RmlDocument | undefined;
let interval: number;
let isMenuOpen = false;

function roundToTwo(value: number) {
  return Math.round(value * 100 + Number.EPSILON) / 100;
}

const InternalFunctions = {
  init(pos: alt.IVector3, options: Array<OptionFor3DMenu>, distance: number) {
    if (!document) {
      return;
    }

    internalOptions = options;
    internalPos = pos;
    maxDistance = distance;
    optionIndex = 0;

    // Options Setup
    const optionsElement = document.getElementByID("options")!;
    for (let i = 0; i < internalOptions.length; i++) {
      const option = internalOptions[i];

      const newOption = document.createElement("div");
      newOption.addClass("option");
      newOption.setAttribute("id", `option-${i}`);
      newOption.innerRML = option.name;

      if (i === 0) {
        newOption.addClass("selected");
      }

      optionsElement.appendChild(newOption);
    }

    interval = alt.setInterval(InternalFunctions.tick, 0);
  },
  updateIndex() {
    if (!document) {
      return;
    }
    const element = document.getElementByID(`option-${optionIndex}`)!;
    element.addClass("selected");
  },
  /**
   * Fully closes the menu and destroys the rmlui document.
   *
   */
  close(skipSound = false) {
    alt.clearInterval(interval);

    if (typeof document !== "undefined") {
      document.destroy();
      document = undefined;
    }

    internalOptions = undefined;
    internalPos = undefined;

    if (!skipSound) {
      game.playSoundFrontend(-1, "CANCEL", "HUD_FREEMODE_SOUNDSET", true);
    }

    isMenuOpen = false;
    alt.off("keyup", InternalFunctions.handleKeyUp);
  },
  /**
   * Called when pressing enter.
   */
  async select() {
    if (!internalOptions) {
      return;
    }
    const option = internalOptions[optionIndex];
    option.callback();

    game.playSoundFrontend(-1, "SELECT", "HUD_FREEMODE_SOUNDSET", true);
    InternalFunctions.close(true);
  },
  /**
   * Moves the option selection navigation up.
   */
  up() {
    if (!document || !internalOptions) {
      return;
    }

    const element = document.getElementByID(`option-${optionIndex}`)!;
    element.removeClass("selected");

    if (optionIndex === 0) {
      optionIndex = internalOptions.length - 1;
    } else {
      optionIndex -= 1;
    }

    InternalFunctions.updateIndex();

    game.playSoundFrontend(-1, "NAV_UP_DOWN", "HUD_FREEMODE_SOUNDSET", true);
  },
  /**
   * Moves the option selection navigation down.
   */
  down() {
    if (!document || !internalOptions) {
      return;
    }

    const element = document.getElementByID(`option-${optionIndex}`)!;
    element.removeClass("selected");

    if (optionIndex === internalOptions.length - 1) {
      optionIndex = 0;
    } else {
      optionIndex += 1;
    }

    InternalFunctions.updateIndex();

    game.playSoundFrontend(-1, "NAV_UP_DOWN", "HUD_FREEMODE_SOUNDSET", true);
  },
  /**
   * Invokes key press functions.
   *
   * @param {number} keycode
   * @return {void}
   */
  handleKeyUp(keycode: number) {
    if (alt.isMenuOpen()) {
      return;
    }

    if (typeof FUNCTION_BINDS[keycode] !== "function") {
      return;
    }

    FUNCTION_BINDS[keycode]();
  },
  tick() {
    if (!internalPos || !document) {
      return;
    }

    const element = document.getElementByID("menu-wrapper");
    if (!element) {
      return;
    }

    const screenPos = alt.worldToScreen(internalPos);
    const dist = alt.Player.local.pos.distanceTo(internalPos);

    if (dist > maxDistance) {
      InternalFunctions.close(true);
      return;
    }

    const scale = (maxDistance - dist) / maxDistance; // 0.0 - 1.0
    element.style["left"] = `${screenPos.x}px`;
    element.style["top"] = `${screenPos.y}px`;
    element.style["transform"] = `scale(${roundToTwo(scale)})`;
  },
};

/**
 * Create an in-world 3D menu with maximum options.
 *
 * @param {alt.IVector3} pos A position in the world.
 * @param {Array<OptionFor3DMenu>} options
 * @param {number} maxDistance
 * @return {void}
 */
export function create(
  pos: alt.IVector3,
  options: Array<OptionFor3DMenu>,
  maxDistance = 8
): void {
  if (isMenuOpen) {
    InternalFunctions.close(true);
  }

  if (options.length > 8) {
    alt.logWarning(
      `Menu Options exceeded 8 entries. Trimmed off excess menu entries.`
    );
    options = options.slice(0, 8);
  }

  if (typeof document === "undefined") {
    document = new alt.RmlDocument(join(__relativedirname, "index.rml"));
    document.show();
  }

  isMenuOpen = true;
  alt.on("keyup", InternalFunctions.handleKeyUp);
  InternalFunctions.init(pos, options, maxDistance);
}

alt.on("keyup", (key) => {
  if (key === KeyCode.K && !isMenuOpen) {
    create(alt.Player.local.pos, [
      { name: "Option 1", callback: () => alt.log("Option 1") },
      { name: "Option 2", callback: () => alt.log("Option 2") },
      { name: "Option 3", callback: () => alt.log("Option 3") },
      { name: "Option 4", callback: () => alt.log("Option 4") },
      { name: "Option 5", callback: () => alt.log("Option 5") },
      { name: "Option 6", callback: () => alt.log("Option 6") },
      { name: "Option 7", callback: () => alt.log("Option 7") },
      { name: "Option 8", callback: () => alt.log("Option 8") },
      { name: "Option 9", callback: () => alt.log("Option 9") },
      { name: "Option 10", callback: () => alt.log("Option 10") },
    ]);
  }
  if (key === KeyCode.L && isMenuOpen) {
    alt.toggleRmlControls(!alt.rmlControlsEnabled());
  }
});

/**
 * Call this function to close the menu.
 * Make sure to wait for it to close before opening a new menu.
 *
 */
export async function close(): Promise<void> {
  await InternalFunctions.close();
  await alt.Utils.wait(100);
}

const FUNCTION_BINDS = {
  [KEYS.ESCAPE_KEY]: InternalFunctions.close,
  [KEYS.UP_KEY]: InternalFunctions.up,
  [KEYS.DOWN_KEY]: InternalFunctions.down,
  [KEYS.ENTER_KEY]: InternalFunctions.select,
};

alt.on("disconnect", () => {
  if (typeof document !== "undefined") {
    document.destroy();
    alt.log("menu3d | Destroyed RMLUI Document on Disconnect");
  }
});
