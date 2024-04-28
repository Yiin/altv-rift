import { computed, ref } from "vue";
import {
  type BlueprintRecipe,
  getBlueprint,
  canCraftRecipe,
  getUpgradeRecipe,
  type Blueprint,
} from "@shared/modules/production";
import { ServerCall } from "@shared/calls/server";
import { ItemSourceOrigin, type PlayerItemSource } from "@shared/interfaces";
import { getInventoryItemInSlot } from "@shared/modules/inventory";
import { useCharacter } from "@/store/synced/character.store";
import { useGameState } from "@/store/synced/game-state.store";
import { rpc } from "@/rpc";

export function getBlueprintRecipes(blueprint: string) {
  return (getBlueprint(blueprint)?.recipes ?? []).filter((recipe) => recipe.isUpgrade);
}

const hasRecipes = computed(() => {
  return useCharacter().blueprints.some((blueprint) => getBlueprintRecipes(blueprint).length > 0);
});

const blueprints = computed(
  () => useCharacter().blueprints.map(getBlueprint).filter(Boolean) as Blueprint[],
);

const currentlyUpgrading = computed(() => useGameState().workbench.upgrading);
const selectedItemSource = ref<PlayerItemSource>();
const selectedItem = computed(() => {
  if (!selectedItemSource.value) {
    return null;
  }
  return getItemFromPlayerSource(selectedItemSource.value);
});

const upgradeRecipe = computed<BlueprintRecipe | null>(() => {
  if (!selectedItem.value) {
    return null;
  }

  return getUpgradeRecipe(selectedItem.value, blueprints.value) ?? null;
});

const canUpgradeSelectedItem = computed(
  () => upgradeRecipe.value && canCraftRecipe(upgradeRecipe.value, useCharacter().inventory),
);

export function getItemFromPlayerSource(source: PlayerItemSource) {
  if (source.origin === ItemSourceOrigin.PlayerEquipment) {
    return useCharacter().equipment[source.equipmentSlot];
  }
  return getInventoryItemInSlot(useCharacter().inventory, source.inventorySlot)?.item;
}

export function useUpgrading() {
  return {
    blueprints,
    hasRecipes,
    selectedItemSource,
    selectedItem,
    upgradeRecipe,
    canUpgradeSelectedItem,
    currentlyUpgrading,
    selectItem(source: PlayerItemSource) {
      if (currentlyUpgrading.value) {
        return;
      }

      selectedItemSource.value = source;
    },
    async onStartUpgrading() {
      if (!selectedItemSource.value) {
        return;
      }

      await rpc.callServer(ServerCall.FromWebview.UPGRADE_ITEM, selectedItemSource.value);
    },
    async cancelUpgrading() {
      await rpc.callServer(ServerCall.FromWebview.CANCEL_UPGRADING);
    },
  };
}
