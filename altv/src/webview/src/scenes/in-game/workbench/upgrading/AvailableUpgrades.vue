<script setup lang="ts">
import { computed, ref } from "vue";
import {
  FirearmWeaponBlueprint,
  MeleeWeaponBlueprint,
  ThrowableWeaponBlueprint,
  ToolBlueprint,
  AmmoBlueprint,
  ClothingBlueprint,
  WeaponComponentBlueprint,
  getUpgradeRecipe,
  getBlueprint,
  canCraftRecipe,
  type Blueprint,
  type BlueprintRecipe,
} from "@shared/modules/production";
import { type PlayerItemSource } from "@shared/interfaces";
import type { Item } from "@shared/modules/items";
import { useCharacter } from "@/store/synced/character.store";
import { px } from "@/composables/use-pixel";
import { isSameItemSource } from "@/store/inventory";
import { asset } from "@/lib/utils";
import Image from "@/components/Image.vue";
import ItemIcon from "../../inventory/ItemIcon.vue";
import WorkbenchSlot from "../components/WorkbenchSlot.vue";
import { useUpgrading, getItemFromPlayerSource } from "../composables/use-upgrading";

const { upgradeableItemSources, selectedItemSource, selectItem } = useUpgrading();

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

const itemsByCategory = computed(() => {
  const items = Object.values(categories).reduce(
    (acc, { name, blueprints }) => {
      const availableCategoryBlueprints = Object.values(blueprints)
        .filter((blueprint) => character.blueprints.includes(blueprint))
        .map(getBlueprint)
        .filter(Boolean) as Blueprint[];

      const items = upgradeableItemSources.value
        .map((itemSource) => ({
          source: itemSource,
          item: getItemFromPlayerSource(itemSource)!,
        }))
        .map(({ item, source }) => ({
          source,
          item,
          recipe: getUpgradeRecipe(item, availableCategoryBlueprints)!,
        }))
        .filter(({ item, recipe }) => {
          return (
            item &&
            recipe &&
            (recipe.item.key.toLowerCase().includes(search.value.toLowerCase()) ||
              ("grade" in recipe.item &&
                recipe.item.grade.toLowerCase() === search.value.toLowerCase()))
          );
        });

      if (items.length > 0) {
        acc[name] = items;
      }
      return acc;
    },
    {} as Record<string, { source: PlayerItemSource; item: Item; recipe: BlueprintRecipe }[]>,
  );

  if (categoryFilter.value === CategoryFilter.ALL) {
    return items;
  }

  const categoryName = categories[categoryFilter.value].name;

  return items[categoryName]?.length ? { [categoryName]: items[categoryName] } : {};
});
</script>

<template>
  <div>
    <div class="text-3xl font-bold">Search</div>
    <input
      type="text"
      class="mb-5 mt-2 w-75 rounded border border-solid border-white/10 bg-transparent px-5 py-5 text-xl text-white focus-within:outline-neutral-500 focus-visible:outline"
      placeholder="Type name of..."
      v-model="search"
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
            <Image
              v-if="category !== 'all'"
              :src="asset(`assets/workbench/categories/${category}.svg`)"
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
    <div
      class="scrollbar-vertical scrollbar overflow-auto pr-3"
      ref="recipesContainerRef"
      :style="{ height: recipesContainerHeight }"
    >
      <div
        v-for="(items, category) in itemsByCategory"
        :key="category"
      >
        <h2 class="mb-3 text-3xl font-bold">{{ category }}</h2>
        <div class="mb-5 flex max-w-110 flex-wrap gap-2.5">
          <WorkbenchSlot
            v-for="{ item, source, recipe } in items"
            @click="() => selectItem(source)"
            :key="`${JSON.stringify(source)}`"
            class="h-18.75 w-18.75 p-0"
            :class="{ 'opacity-50': !canCraftRecipe(character, recipe) }"
            :selected="isSameItemSource(source, selectedItemSource)"
          >
            <ItemIcon
              :item="item"
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
