import alt from "@altv/client";
import game from "@altv/natives";
import { ref } from "vue";
import { Control, ControlType } from "@/core/constants/controls";
import { isInConversation } from "@/modules/questing/conversation";
import { getCurrentNode } from "../internals/current-node";
import { AnchorEntity } from "../types";
import { getFocusedEntity } from "./focused-entity";

type Menu<T> = {
  options: T[];
  onSelect(option: T): void;
  onLeave?(): void;
  node: alt.RmlElement;
  drawDistance?: number;
};

const registeredMenus: WeakMap<AnchorEntity, Menu<any>> = new WeakMap();
let currentEntity: AnchorEntity | null = null;
let currentIndex = ref(0);

export function resetMenu() {
  if (currentEntity) {
    const currentMenu = registeredMenus.get(currentEntity);

    if (currentMenu) {
      currentMenu.onLeave?.();
    }
  }
  currentEntity = null;
  currentIndex.value = 0;
}

export function updateMenu() {
  const entity = getFocusedEntity();

  if (!entity) {
    resetMenu();
    return;
  }

  if (entity !== currentEntity) {
    if (currentEntity) {
      const currentMenu = registeredMenus.get(currentEntity);

      if (currentMenu) {
        currentMenu.onLeave?.();
      }
    }
    currentEntity = entity;
    currentIndex.value = 0;
  }
}

export function useMenu<T>(options: T[], menu: Omit<Menu<T>, "options" | "node">) {
  registeredMenus.set(getCurrentNode().entity, {
    ...menu,
    options,
    node: getCurrentNode(),
  });
  return menuControls as MenuControls<T>;
}

type MenuControls<T> = {
  selectNext(): void;
  selectPrevious(): void;
  currentIndex(): number;
  interactions: T[];
  isActive: boolean;
};

const menuControls: MenuControls<any> = {
  selectNext() {
    if (!currentEntity) {
      return;
    }
    const currentMenu = registeredMenus.get(currentEntity);

    if (!currentMenu) {
      return;
    }

    if (++currentIndex.value >= currentMenu.options.length) {
      currentIndex.value = 0;
    }
    if (currentMenu.options.length > 1) {
      game.playSoundFrontend(-1, "NAV_UP_DOWN", "HUD_FREEMODE_SOUNDSET", true);
    }
  },

  selectPrevious() {
    if (!currentEntity) {
      return;
    }
    const currentMenu = registeredMenus.get(currentEntity);

    if (!currentMenu) {
      return;
    }

    if (--currentIndex.value < 0) {
      currentIndex.value = Math.max(0, currentMenu.options.length - 1);
    }
    if (currentMenu.options.length > 1) {
      game.playSoundFrontend(-1, "NAV_UP_DOWN", "HUD_FREEMODE_SOUNDSET", true);
    }
  },

  currentIndex() {
    if (getFocusedEntity() !== getCurrentNode().entity) {
      return -1;
    }
    return currentIndex.value;
  },

  get interactions() {
    return registeredMenus.get(getCurrentNode().entity)!.options;
  },

  get isActive() {
    if (currentEntity !== getCurrentNode().entity) {
      return false;
    }
    const currentMenu = registeredMenus.get(currentEntity);

    if (!currentMenu) {
      return false;
    }

    return currentMenu.drawDistance ? currentMenu.drawDistance > alt.Player.local.pos.distanceTo(currentEntity.pos) : true;
  },
};

alt.Timers.everyTick(() => {
  if (!currentEntity) {
    return;
  }

  const currentMenu = registeredMenus.get(currentEntity);

  if (!currentMenu) {
    return;
  }

  if (!currentMenu.node.valid || !currentMenu.node.isVisible) {
    return;
  }

  if (isInConversation()) {
    return;
  }

  game.disablePlayerFiring(alt.Player.local, false);
  game.disableControlAction(ControlType.PLAYER_CONTROL, Control.INPUT_ATTACK, true);
  game.disableControlAction(ControlType.PLAYER_CONTROL, Control.INPUT_WEAPON_WHEEL_NEXT, true);
  game.disableControlAction(ControlType.PLAYER_CONTROL, Control.INPUT_WEAPON_WHEEL_PREV, true);

  if (game.isDisabledControlJustPressed(ControlType.PLAYER_CONTROL, Control.INPUT_WEAPON_WHEEL_PREV)) {
    menuControls.selectPrevious();
  } else if (
    game.isDisabledControlJustPressed(ControlType.PLAYER_CONTROL, Control.INPUT_WEAPON_WHEEL_NEXT)
  ) {
    menuControls.selectNext();
  } else if (game.isDisabledControlJustPressed(ControlType.PLAYER_CONTROL, Control.INPUT_ATTACK)) {
    game.playSoundFrontend(-1, "SELECT", "HUD_FREEMODE_SOUNDSET", true);
    currentMenu.onSelect(currentMenu.options[currentIndex.value]);
  }
});
