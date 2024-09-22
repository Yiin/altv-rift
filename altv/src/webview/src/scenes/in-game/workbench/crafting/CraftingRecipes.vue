<script setup lang="ts">
import { computed, ref } from "vue";
import { getItemName } from "@shared/modules/items";
import {
  FirearmWeaponBlueprint,
  MeleeWeaponBlueprint,
  ThrowableWeaponBlueprint,
  ToolBlueprint,
  AmmoBlueprint,
  ClothingBlueprint,
  WeaponComponentBlueprint,
  canCraftRecipe,
  type BlueprintRecipe,
} from "@shared/modules/production";
import { useCharacter } from "@/store/synced/character.store";
import { px } from "@/composables/use-pixel";
import { asset } from "@/lib/utils";
import ItemIcon from "../../inventory/ItemIcon.vue";
import WorkbenchSlot from "../components/WorkbenchSlot.vue";
import { getBlueprintRecipes, useCrafting } from "../composables/use-crafting";

const { selectedRecipe } = useCrafting();

const CategoryFilter = {
  ALL: "all",
  FIREARM_WEAPONS: "firearm_weapons",
  MELEE_WEAPONS: "melee_weapons",
  THROWABLE_WEAPONS: "throwable_weapons",
  GATHERING_TOOLS: "gathering_tools",
  WEAPON_AMMO: "weapon_ammo",
  CLOTHING: "clothing",
  WEAPON_COMPONENTS: "weapon_components",
} as const;

const categories = {
  [CategoryFilter.FIREARM_WEAPONS]: {
    blueprints: FirearmWeaponBlueprint,
    name: "Firearm weapons",
  },
  [CategoryFilter.MELEE_WEAPONS]: {
    blueprints: MeleeWeaponBlueprint,
    name: "Melee weapons",
  },
  [CategoryFilter.THROWABLE_WEAPONS]: {
    blueprints: ThrowableWeaponBlueprint,
    name: "Throwable weapons",
  },
  [CategoryFilter.GATHERING_TOOLS]: {
    blueprints: ToolBlueprint,
    name: "Gathering tools",
  },
  [CategoryFilter.WEAPON_AMMO]: {
    blueprints: AmmoBlueprint,
    name: "Weapon Ammo",
  },
  [CategoryFilter.CLOTHING]: {
    blueprints: ClothingBlueprint,
    name: "Clothing",
  },
  [CategoryFilter.WEAPON_COMPONENTS]: {
    blueprints: WeaponComponentBlueprint,
    name: "Weapon Components",
  },
};

const character = useCharacter();

const hideUnavailable = ref(true);
const search = ref("");

const recipesContainerRef = ref<HTMLDivElement>();
const recipesContainerHeight = computed(() => {
  if (!recipesContainerRef.value) return 0;
  const value = window.innerHeight - recipesContainerRef.value.getBoundingClientRect().y - px(48);
  return `${value}px`;
});

const categoryFilter = ref<(typeof CategoryFilter)[keyof typeof CategoryFilter]>(
  CategoryFilter.ALL,
);

const recipesByCategory = computed(() => {
  const recipes = Object.values(categories).reduce(
    (acc, { name, blueprints }) => {
      const blueprintRecipes = Object.values(blueprints)
        .filter((blueprint) => character.blueprints.includes(blueprint))
        .flatMap((blueprint) => getBlueprintRecipes(blueprint))
        .filter((recipe) => !hideUnavailable.value || canCraftRecipe(character, recipe))
        .filter(
          (recipe) =>
            getItemName(recipe.item.key).toLowerCase().includes(search.value.toLowerCase()) ||
            ("grade" in recipe.item &&
              recipe.item.grade.toLowerCase() === search.value.toLowerCase()),
        );

      if (blueprintRecipes.length > 0) {
        acc[name] = blueprintRecipes;
      }
      return acc;
    },
    {} as Record<string, BlueprintRecipe[]>,
  );

  return categoryFilter.value === CategoryFilter.ALL
    ? recipes
    : { [categories[categoryFilter.value].name]: recipes[categories[categoryFilter.value].name] };
});
</script>

<template>
  <div>
    <div class="text-3xl font-bold">Search</div>
    <input
      type="text"
      class="mb-5 mt-2 w-75 rounded border border-solid border-white/10 px-5 py-5 text-xl focus-within:outline-neutral-500 focus-visible:outline"
      placeholder="Type name of..."
      v-model="search"
    />
    <div>
      <div class="mb-6 flex w-105.5 flex-wrap items-center justify-between">
        <div class="mb-2 flex items-center gap-2.5">
          <WorkbenchSlot
            @click="hideUnavailable = !hideUnavailable"
            :selected="hideUnavailable"
            class="h-11 w-11 p-2.5"
          >
            <v-icon icon="mdi-check" />
          </WorkbenchSlot>
          <div>Show only available recipes</div>
        </div>
        <div class="flex flex-wrap gap-2.5">
          <WorkbenchSlot
            v-for="category in Object.values(CategoryFilter)"
            :key="category"
            @click="categoryFilter = category"
            :selected="category === categoryFilter"
            class="h-11 w-11 p-2"
          >
            <img
              v-if="category !== 'all'"
              :src="asset(`assets/workbench/categories/${category}.svg`)"
              :class="[category === 'weapon_components' ? 'h-6 w-6' : 'h-4 w-4']"
            />
            <span
              v-else
              class="-mb-1"
            >
              All
            </span>
          </WorkbenchSlot>
        </div>
      </div>
    </div>
    <div
      class="scrollbar-vertical scrollbar overflow-auto pr-3"
      ref="recipesContainerRef"
      :style="{ height: recipesContainerHeight }"
    >
      <div
        v-for="(recipes, category) in recipesByCategory"
        :key="category"
      >
        <h2 class="mb-3 text-3xl font-bold">{{ category }}</h2>
        <div class="mb-5 flex max-w-110 flex-wrap gap-2.5">
          <WorkbenchSlot
            @click="selectedRecipe = recipe"
            v-for="(recipe, index) in recipes"
            :key="`${recipe.item.key}-${index}`"
            class="h-18.75 w-18.75 p-0"
            :class="{ 'opacity-50': !canCraftRecipe(character, recipe) }"
            :selected="JSON.stringify(selectedRecipe) === JSON.stringify(recipe)"
          >
            <ItemIcon
              :item="recipe.item"
              width="100%"
              height="100%"
              class="drop-shadow-md"
            />
          </WorkbenchSlot>
        </div>
      </div>
    </div>
  </div>
</template>
