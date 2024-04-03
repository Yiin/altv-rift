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
  type BlueprintRecipe,
} from "@shared/modules/production";
import {getItemName, getWeaponStats, type Item} from "@shared/modules/items";
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

function fulfillsRequirement(part: Item) {
  const inventoryItem = character.inventory.items.find(({ item }) =>
    Object.entries(part).every(([key, value]) => item[key as keyof typeof item] === value),
  );

  return inventoryItem;
}

const selectedItem: BlueprintRecipe = ref({
  isUpgrade: false,
  item: { key: "", grade: "" },
  parts: [],
  durationSeconds: 0,
});
</script>

<template>
  <div class="mt-40 flex justify-between gap-10 text-white">
    <div>
      <h1 class="mb-4 text-4xl font-extrabold">Search</h1>
      <input
        type="text"
        class="mb-4 w-[300px] rounded border border-solid border-white/10 p-8"
        placeholder="Type name of..."
      />
      <div>
        <div class="mb-6 flex flex-wrap items-center justify-between">
          <div class="flex flex-wrap gap-2.5">
            <button
              v-for="category in Object.values(CategoryFilter)"
              :key="category"
              @click="categoryFilter = category"
              class="h-16 w-16 rounded-md border border-solid border-white/30 p-2"
              :class="{
                'border-[#EE2E24]/[0.5] bg-gradient-to-t from-[#EE2E24]/[0.5]':
                  categoryFilter === category,
                'hover:border-[#929292] hover:bg-[#929292]/[0.5]': categoryFilter !== category,
              }"
            >
              <img
                v-if="category !== 'all'"
                :src="`./assets/workbench/categories/${category}.svg`"
                alt=""
              />
              <span v-else>All</span>
            </button>
          </div>
        </div>
      </div>
      <div>
        <div class="mt-10">
          <div class="flex flex-wrap gap-2.5">
            <div
              @click="selectedItem = recipe"
              v-for="(recipe, index) in recipes"
              :key="`${recipe.item.key}-${index}`"
              class="flex h-20 w-20 rounded-md border border-white/30"
              :class="{
                'border-[#EE2E24]/[0.5] bg-gradient-to-t from-[#EE2E24]/[0.5]':
                  selectedItem.item.key + selectedItem.item.grade ===
                  recipe.item.key + recipe.item.grade,
                'hover:border-[#929292] hover:bg-[#929292]/[0.5]':
                  selectedItem.item.key + selectedItem.item.grade !==
                  recipe.item.key + recipe.item.grade,
              }"
            >
              <v-img :src="getItemImage(recipe.item.key)" />
              <!--                          <div class="text-center text-white">{{ getItemName(recipe.item.key) }}</div>-->

              <!--                          <div class="flex gap-5">-->
              <!--                            <div class="flex flex-col gap-2">-->
              <!--                              &lt;!&ndash; Requirements &ndash;&gt;-->
              <!--                              <div class="text-white">Requirements</div>-->
              <!--                              <div class="flex flex-col gap-1">-->
              <!--                                <div-->
              <!--                                  v-for="(part, index) in recipe.parts"-->
              <!--                                  :key="`${part.key}-${index}`"-->
              <!--                                  class="flex items-center gap-2"-->
              <!--                                >-->
              <!--                                  <v-img :src="getItemImage(part.key)" />-->
              <!--                                  <div class="text-sm text-white">{{ getItemName(part.key) }}</div>-->
              <!--&lt;!&ndash;&ndash;&gt;-->
              <!--                                  <div-->
              <!--                                    v-if="'amount' in part"-->
              <!--                                    class="text-sm text-white"-->
              <!--                                  >-->
              <!--                                    {{ part.amount }}-->
              <!--                                  </div>-->
              <!--&lt;!&ndash;&ndash;&gt;-->
              <!--                                  <div-->
              <!--                                    class="rounded-md border border-solid border-white/30 px-3 py-1 uppercase"-->
              <!--                                    :class="{-->
              <!--              // &lt;!&ndash;                        'bg-sunriseYellow text-black shadow-sunriseYellow':&ndash;&gt;-->
              <!--              // &lt;!&ndash;                          fulfillsRequirement(part),&ndash;&gt;-->
              <!--              // &lt;!&ndash;                        'transition duration-200 hover:bg-white/10': !fulfillsRequirement(part),&ndash;&gt;-->
              <!--                                    }"-->
              <!--                                  >-->
              <!--                                    {{ fulfillsRequirement(part) ? "✓" : "x" }}-->
              <!--                                  </div>-->
              <!--                                </div>-->
              <!--                              </div>-->
            </div>
          </div>
        </div>
      </div>
    </div>

    <!--        <h2 class="mb-4 text-4xl font-extrabold">Handguns</h2>-->
    <!--        <div class="flex">-->
    <!--          <div class="mr-4 h-20 w-20 border border-white/10"></div>-->
    <!--          <div class="mr-4 h-20 w-20 border border-white/10"></div>-->
    <!--          <div class="mr-4 h-20 w-20 border border-white/10"></div>-->
    <!--          <div class="mr-4 h-20 w-20 border border-white/10"></div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--      <div>-->
    <!--        <h2 class="mb-4 text-4xl font-extrabold">SMGs</h2>-->
    <!--        <div class="flex">-->
    <!--          <div class="mr-4 h-20 w-20 border border-white/10"></div>-->
    <!--          <div class="mr-4 h-20 w-20 border border-white/10"></div>-->
    <!--          <div class="mr-4 h-20 w-20 border border-white/10"></div>-->
    <!--          <div class="mr-4 h-20 w-20 border border-white/10"></div>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->
    <div class="justify-center text-center">
      <h2 class="text-2xl font-extrabold">In queue</h2>
      <div class="mb-4 flex justify-center">
        <img
          :src="`./assets/workbench/ornament.svg`"
          class="align-self-center"
        />
      </div>
      <div class="mb-4 flex justify-center">
        <div class="mr-4 h-20 w-20 border border-white/10"></div>
        <div class="mr-4 h-20 w-20 border border-white/10"></div>
        <div class="mr-4 h-20 w-20 border border-white/10"></div>
        <div class="mr-4 h-20 w-20 border border-white/10"></div>
        <div class="mr-4 h-20 w-20 border border-white/10"></div>
        <div class="mr-4 h-20 w-20 border border-white/10"></div>
        <div class="mr-4 h-20 w-20 border border-white/10"></div>
      </div>
      <div>
        <div class="mb-6 flex justify-center">
          <v-img
            class="absolute"
            :src="getItemImage(selectedItem.item.key)"
          />
          <img
            :src="`./assets/workbench/weapon-ornament.svg`"
            class="align-self-center"
          />
        </div>
        <v-progress-linear model-value="20" />
        <p class="text-grey mb-6">
          Now is crafting
          <span class="text-white">Pistol</span>
        </p>
<!--        {{ getWeaponStats(selectedItem.item.key) }}-->
        <div class="mb-4 flex justify-center">
          <div class="mr-4 h-24 w-24 border border-white/10">
            <h3 class="pt-4 text-3xl text-red-500">120</h3>
            Fire rate
          </div>
          <div class="mr-4 h-24 w-24 border border-white/10">
            <h3 class="pt-4 text-3xl text-red-500">90</h3>
            Accuracy
          </div>
          <div class="mr-4 h-24 w-24 border border-white/10">
            <h3 class="pt-4 text-3xl text-red-500">60</h3>
            Damage
          </div>
          <div class="mr-4 h-24 w-24 border border-white/10">
            <h3 class="pt-4 text-3xl text-red-500">80</h3>
            Clip
          </div>
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
          It is a long established fact that a reader will be distracted by the readable content of
          a page when looking at its layout.
        </p>
      </div>
    </div>
    <div class="w-[280px] text-right">
      <div v-show="!!selectedItem">
        <h2 class="text-4xl font-extrabold">{{ getItemName(selectedItem.item.key) }}</h2>
        <h3 class="font-medium text-gray-500">Crafting recipe</h3>
        <p>
          Standard handgun. A .45 caliber combat pistol with a magazine capacity of 12 rounds that
          can be extended to 16.
        </p>
        <div class="mb-12 flex flex-wrap items-center gap-2">
          <div
            v-for="(part, index) in selectedItem.parts"
            :key="`${part.key}-${index}`"
            class="h-28 w-28 rounded-md border border-white/10"
          >
            <v-img :src="getItemImage(part.key)" />
            <div class="text-sm text-white">{{ getItemName(part.key) }}</div>
            <!---->
            <div
              v-if="'amount' in part"
              class="text-sm text-white"
            >
              {{ part.amount }}
            </div>
            <!---->
            <!--            <div class="rounded-md border border-solid border-white/30 px-3 py-1 uppercase">-->
            <!--              {{ fulfillsRequirement(part) ? "✓" : "x" }}-->
            <!--            </div>-->
          </div>
        </div>
        <h2 class="mb-4 text-2xl font-bold">Crafting information</h2>
        <div class="mb-4 flex justify-end gap-2">
          <div class="w-32 border border-white/30 p-4 font-bold text-gray-500">
            Success rate
            <div class="text-right text-yellow-500">32%</div>
          </div>
          <div class="w-32 border border-white/30 p-4 font-bold text-gray-500">
            Crafting time
            <div class="text-white">{{ selectedItem.durationSeconds }} s</div>
          </div>
        </div>
        <div class="justify-space-between flex border border-white/30 p-4">
          <div>-</div>
          <div>1</div>
          <div>+</div>
        </div>
        <button class="button flex p-4 text-xl font-extrabold">Begin Crafting</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.button {
  border-radius: 4px;
  border: 1px solid rgba(238, 46, 36, 0.3);
  background: linear-gradient(180deg, rgba(238, 46, 36, 0) 0%, rgba(238, 46, 36, 0.3) 100%);
}
</style>
