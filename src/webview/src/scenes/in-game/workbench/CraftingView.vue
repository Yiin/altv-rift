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
  getBlueprint,
} from "@shared/modules/production";
import { getItemName, type Item } from "@shared/modules/items";
import { getItemImage } from "@/utils/items";
import { useCharacter } from "@/store/synced/character.store";

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
  [CategoryFilter.FIREARM_WEAPONS]: FirearmWeaponBlueprint,
  [CategoryFilter.MELEE_WEAPONS]: MeleeWeaponBlueprint,
  [CategoryFilter.THROWABLE_WEAPONS]: ThrowableWeaponBlueprint,
  [CategoryFilter.GATHERING_TOOLS]: ToolBlueprint,
  [CategoryFilter.WEAPON_AMMO]: AmmoBlueprint,
  [CategoryFilter.CLOTHING]: ClothingBlueprint,
  [CategoryFilter.WEAPON_COMPONENTS]: WeaponComponentBlueprint,
};

const categoryFilter = ref<(typeof CategoryFilter)[keyof typeof CategoryFilter]>(
  CategoryFilter.ALL,
);

const categoryBlueprints = computed(() => {
  if (categoryFilter.value === CategoryFilter.ALL) {
    return Object.values(categories).flatMap((category) => Object.values(category));
  }
  return Object.values(categories[categoryFilter.value]);
});

const character = useCharacter();

const recipes = computed(() =>
  character.blueprints
    .filter((blueprint) => categoryBlueprints.value.includes(blueprint))
    .flatMap((blueprint) => getBlueprint(blueprint)?.recipes ?? []),
);

function fullfillsRequirement(part: Item) {
  const inventoryItem = character.inventory.items.find(({ item }) =>
    Object.entries(part).every(([key, value]) => item[key as keyof typeof item] === value),
  );

  return inventoryItem;
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <div class="flex gap-2.5">
        <button
          v-for="category in Object.values(CategoryFilter)"
          :key="category"
          @click="categoryFilter = category"
          class="rounded-md border border-solid border-white/30 px-11 py-3 uppercase"
          :class="{
            'bg-sunriseYellow text-black shadow-sunriseYellow': categoryFilter === category,
            'transition duration-200 hover:bg-white/10': categoryFilter !== category,
          }"
        >
          {{ category }}
        </button>
      </div>
      <BackButtons />
    </div>
    <div class="mt-10 grid grid-cols-3 gap-10">
      <div
        v-for="(recipe, index) in recipes"
        :key="`${recipe.item.key}-${index}`"
        class="flex flex-col items-center gap-5"
      >
        <v-img :src="getItemImage(recipe.item.key)" />
        <div class="text-center text-white">{{ getItemName(recipe.item.key) }}</div>

        <div class="flex gap-5">
          <div class="flex flex-col gap-2">
            <!-- Requirements -->
            <div class="text-white">Requirements</div>
            <div class="flex flex-col gap-1">
              <div
                v-for="(part, index) in recipe.parts"
                :key="`${part.key}-${index}`"
                class="flex items-center gap-2"
              >
                <v-img :src="getItemImage(part.key)" />
                <div class="text-sm text-white">{{ getItemName(part.key) }}</div>

                <div
                  v-if="'amount' in part"
                  class="text-sm text-white"
                >
                  {{ part.amount }}
                </div>

                <div
                  class="rounded-md border border-solid border-white/30 px-3 py-1 uppercase"
                  :class="{
                    'bg-sunriseYellow text-black shadow-sunriseYellow': fullfillsRequirement(part),
                    'transition duration-200 hover:bg-white/10': !fullfillsRequirement(part),
                  }"
                >
                  {{ fullfillsRequirement(part) ? "✓" : "x" }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
