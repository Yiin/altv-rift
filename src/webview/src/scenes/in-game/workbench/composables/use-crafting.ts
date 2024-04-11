import { computed, reactive, ref } from "vue";
import { type BlueprintRecipe, getBlueprint } from "@shared/modules/production";
import { useCharacter } from "@/store/synced/character.store";

export function getBlueprintRecipes(blueprint: string) {
  return (getBlueprint(blueprint)?.recipes ?? []).filter((recipe) => !recipe.isUpgrade);
}

const hasRecipes = computed(() => {
  return useCharacter().blueprints.some((blueprint) => getBlueprintRecipes(blueprint).length > 0);
});

const queue = reactive<any[]>([]);

const selectedRecipe = ref<BlueprintRecipe>();

export function useCrafting() {
  return {
    hasRecipes,
    queue,
    selectedRecipe,
    onStartCrafting(quantity: number) {
      for (let i = 0; i < quantity; i++) {
        queue.push({ ...selectedRecipe.value });
      }
    },
    cancelCrafting() {
      queue.shift();
      selectedRecipe.value = queue[0];
    },
    removeFromQueue() {
      const index = queue.findIndex((recipe) => recipe === selectedRecipe.value);
      queue.splice(index, 1);
      selectedRecipe.value = queue[index] ?? queue[index - 1];
    },
  };
}
