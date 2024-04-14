import { computed, ref } from "vue";
import {
  type BlueprintRecipe,
  getBlueprint,
  CraftingResult,
  canCraftRecipe,
} from "@shared/modules/production";
import { ServerCall } from "@shared/calls/server";
import { useCharacter } from "@/store/synced/character.store";
import { useGameState } from "@/store/synced/game-state.store";
import { rpc } from "@/rpc";

export function getBlueprintRecipes(blueprint: string) {
  return (getBlueprint(blueprint)?.recipes ?? []).filter((recipe) => !recipe.isUpgrade);
}

const hasRecipes = computed(() => {
  return useCharacter().blueprints.some((blueprint) => getBlueprintRecipes(blueprint).length > 0);
});

const queue = computed(() => useGameState().workbench.queue);
const startedCraftingAt = computed(() => useGameState().workbench.startedAt);
const selectedRecipe = ref<BlueprintRecipe>();
const canCraftSelectedRecipe = computed(
  () =>
    selectedRecipe.value &&
    canCraftRecipe(selectedRecipe.value, useCharacter().inventory) === CraftingResult.OK,
);
const currentlyCrafting = computed(() => queue.value[0]);

export function useCrafting() {
  return {
    hasRecipes,
    queue,
    selectedRecipe,
    canCraftSelectedRecipe,
    currentlyCrafting,
    startedCraftingAt,
    async onStartCrafting(quantity: number) {
      if (!selectedRecipe.value) {
        return;
      }

      const success = await rpc.callServer(
        ServerCall.FromWebview.CRAFT_ITEM,
        selectedRecipe.value.key,
        quantity,
      );

      if (success) {
        selectedRecipe.value = queue.value[0];
      }
    },
    async cancelCrafting() {
      const success = await rpc.callServer(ServerCall.FromWebview.CANCEL_CRAFTING);

      if (success) {
        selectedRecipe.value = queue.value[0];
      }
    },
    async removeFromQueue() {
      const index = queue.value.findIndex((recipe) => recipe === selectedRecipe.value);

      const success = await rpc.callServer(
        ServerCall.FromWebview.REMOVE_FROM_CRAFTING_QUEUE,
        index,
      );

      if (success) {
        selectedRecipe.value = queue.value[index] ?? queue.value[index - 1];
      }
      // const stop = watch(
      //   () => queue,
      //   () => {
      //     if (!queue.value.includes(selecte//dRecipe.value)) {
      //       selectedRecipe.value = queue.value[index] ?? queue.value[index - 1];
      //       stop();
      //     }
      //   },
      // );
    },
  };
}
