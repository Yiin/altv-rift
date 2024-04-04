<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import {
  FirearmWeaponBlueprint,
  MeleeWeaponBlueprint,
  ThrowableWeaponBlueprint,
  ToolBlueprint,
  AmmoBlueprint,
  ClothingBlueprint,
  WeaponComponentBlueprint,
  getBlueprint,
  type BlueprintRecipe,
} from "@shared/modules/production";
import {
  getItemName,
  getWeaponStats,
  ItemGrade,
  type Item,
  getItemDescription,
} from "@shared/modules/items";
import { getItemImage } from "@/utils/items";
import { useCharacter } from "@/store/synced/character.store";
import ItemIcon from "../inventory/ItemIcon.vue";
import WorkbenchSlot from "./components/WorkbenchSlot.vue";

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

const categoryFilter = ref<(typeof CategoryFilter)[keyof typeof CategoryFilter]>(
  CategoryFilter.ALL,
);

function getBlueprintRecipes(blueprint: string) {
  return (getBlueprint(blueprint)?.recipes ?? []).filter((recipe) => !recipe.isUpgrade);
}

const recipesByCategory = computed(() => {
  const recipes = Object.values(categories).reduce(
    (acc, { name, blueprints }) => {
      const blueprintRecipes = Object.values(blueprints)
        .filter((blueprint) => character.blueprints.includes(blueprint))
        .flatMap((blueprint) => getBlueprintRecipes(blueprint));

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

const queue = reactive<any[]>([]);

// function fulfillsRequirement(part: Item) {
//   const inventoryItem = character.inventory.items.find(({ item }) =>
//     Object.entries(part).every(([key, value]) => item[key as keyof typeof item] === value),
//   );

//   return inventoryItem;
// }

const selectedRecipe = ref<BlueprintRecipe>();
</script>

<template>
  <div class="mt-40 flex justify-between gap-10 text-white">
    <div class="self-start">
      <div class="text-4xl font-extrabold">Search</div>
      <input
        type="text"
        class="mb-[1.125rem] w-[18.75rem] rounded border border-solid border-white/10 p-5"
        placeholder="Type name of..."
      />
      <div>
        <div class="mb-6 flex flex-wrap items-center justify-between">
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
                :src="`./assets/workbench/categories/${category}.svg`"
                class="h-4 w-4"
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
      <div class="max-h-[45rem] overflow-auto">
        <div
          v-for="(recipes, category) in recipesByCategory"
          :key="category"
        >
          <h2 class="mb-3 text-3xl font-bold">{{ category }}</h2>
          <div class="max-w-110 mb-5 flex flex-wrap gap-2.5">
            <WorkbenchSlot
              @click="selectedRecipe = recipe"
              v-for="(recipe, index) in recipes"
              :key="`${recipe.item.key}-${index}`"
              class="h-20 w-20 p-0"
              :selected="selectedRecipe === recipe"
            >
              <ItemIcon :item="recipe.item" />
            </WorkbenchSlot>
          </div>
        </div>
      </div>
    </div>
    <div class="align-self-center items-start justify-center text-center">
      <div :class="[queue.length > 0 ? 'visible' : 'invisible']">
        <h2 class="text-2xl font-extrabold">In queue</h2>
        <div class="mb-4 flex justify-center">
          <img
            :src="`./assets/workbench/ornament.svg`"
            class="align-self-center"
          />
        </div>
        <div class="mb-11 flex justify-center gap-4">
          <WorkbenchSlot
            v-for="(_, i) in queue"
            :key="i"
            class="h-20 w-20"
            :selected="false"
          />
        </div>
      </div>
      <template v-if="selectedRecipe">
        <div>
          <div class="mb-6 flex justify-center">
            <img
              :src="`./assets/workbench/weapon-ornament.svg`"
              class="align-self-center h-[17.4375rem] w-[12.1875rem]"
            />
            <v-img
              class="absolute h-[16.625rem] w-135"
              :src="getItemImage(selectedRecipe.item.key)"
            />
          </div>
          <v-progress-linear model-value="20" />
          <div class="text-grey mb-6 mt-3">
            Now is crafting
            <span class="text-white">{{ getItemName(selectedRecipe.item.key) }}</span>
          </div>
          <!--        {{ getWeaponStats(selectedItem.item.key) }}-->
          <div class="mb-4 flex justify-center gap-3.5">
            <WorkbenchSlot
              class="h-24 w-24 flex-col"
              static
            >
              <h3 class="text-3xl font-bold text-red-500">120</h3>
              Fire rate
            </WorkbenchSlot>
            <WorkbenchSlot
              class="h-24 w-24 flex-col"
              static
            >
              <h3 class="text-3xl font-bold text-red-500">90</h3>
              Accuracy
            </WorkbenchSlot>
            <WorkbenchSlot
              class="h-24 w-24 flex-col"
              static
            >
              <h3 class="text-3xl font-bold text-red-500">60</h3>
              Damage
            </WorkbenchSlot>
            <WorkbenchSlot
              class="h-24 w-24 flex-col"
              static
            >
              <h3 class="text-3xl font-bold text-red-500">80</h3>
              Clip
            </WorkbenchSlot>
          </div>
        </div>
        <div>
          <h2 class="text-2xl font-bold">Item description</h2>
          <div class="my-4 flex justify-center">
            <img
              :src="`./assets/workbench/ornament.svg`"
              class="align-self-center"
            />
          </div>
          <p class="text-grey">
            It is a long established fact that a reader will be distracted by the readable content
            of a page when looking at its layout.
          </p>
        </div>
      </template>
    </div>
    <div class="self-right w-[17.5rem] text-right">
      <template v-if="selectedRecipe">
        <div class="text-3xl font-bold">{{ getItemName(selectedRecipe.item.key) }}</div>
        <div class="text-xl font-medium text-gray-500">Crafting recipe</div>
        <div class="mt-4 text-right font-medium text-white">
          {{ getItemDescription(selectedRecipe.item.key) }}
        </div>
        <div class="mb-12 mt-5 flex flex-wrap items-center justify-end gap-2">
          <WorkbenchSlot
            v-for="(part, index) in selectedRecipe.parts"
            :key="`${part.key}-${index}`"
            class="relative h-28 w-28"
            :selected="false"
          >
            <ItemIcon
              :item="part"
              hide-amount
            />
            <div class="absolute left-2.5 top-2.5 max-w-24 text-left text-sm text-white">
              {{ getItemName(part.key) }}
            </div>
            <div
              v-if="'amount' in part"
              class="absolute bottom-1 right-1 rounded bg-red-600 px-1.5 pb-1 pt-1.5 text-sm font-extrabold text-white"
            >
              x{{ part.amount }}
            </div>
          </WorkbenchSlot>
        </div>
        <h2 class="mb-4 text-2xl font-bold">Crafting information</h2>
        <div class="mb-4 flex justify-end gap-2">
          <div class="w-32 border border-white/30 p-4 font-bold text-gray-500">
            Success rate
            <div class="text-right text-yellow-500">32%</div>
          </div>
          <div class="w-32 border border-white/30 p-4 font-bold text-gray-500">
            Crafting time
            <div class="text-white">{{ selectedRecipe.durationSeconds }} s</div>
          </div>
        </div>
        <div class="justify-space-between flex border border-white/30 p-4">
          <div>-</div>
          <div>1</div>
          <div>+</div>
        </div>
        <button class="button flex p-4 text-xl font-extrabold">Begin Crafting</button>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.button {
  border-radius: 4px;
  border: 1px solid rgba(238, 46, 36, 0.3);
  background: linear-gradient(180deg, rgba(238, 46, 36, 0) 0%, rgba(238, 46, 36, 0.3) 100%);
}
</style>
