<script setup lang="ts">
import { computed, effect, ref } from "vue";
import { getItemName } from "@shared/modules/items";
import { getItemImage } from "@/utils/items";
import { useShop } from "@/store/shop.store";
import { SlottedInventoryItem } from "@/store/inventory.store";

const shop = useShop();

const itemName = computed(() => shop.item && getItemName(shop.item.item.key));

const amount = ref(1);
const price = computed(() => shop.item && shop.item.price ? shop.item.price * amount.value : 0);

effect(() => {
  console.log(shop.action, shop.item);
  if (!shop.item || !('amount' in shop.item.item)) {
    return;
  }
  amount.value = Math.min(Math.max(amount.value, 1), shop.item.item.amount) || 1;
});

function submit() {
  if (!shop.item) {
    return;
  }
  shop.submit(amount.value);
}
</script>

<template>
  <div v-if="shop.action && shop.item"
    class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 z-max rounded-lg bg-neutral-900 text-white p-8 shadow-2xl min-w-64">
    <div>
      <div>
        <img
          class="h-28 mb-2"
          :src="getItemImage(shop.item.item)" />
        <h2 class="text-lg font-bold">
          You are {{ `${shop.action}ing` }}<br><span class="text-red-500">{{ itemName }}</span>
        </h2>

        <div v-if="'amount' in shop.item.item && shop.item.item.amount > 1"
          class="relative w-full mt-2 pt-1 pb-3 mb-6 border-y-1 border-neutral-700">
          <div class="space-y-4">
            <div class="space-y-2">
              <label
                class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                for="amount">
                Amount
              </label>
              <div class="flex align-center gap-2">
                <input
                  v-model="amount"
                  class="flex font-bold h-10 w-28 rounded-md border border-input bg-neutral-700 px-3 py-2 pt-1 text-md leading-[0] focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="Enter amount"
                  type="number" />
                <div class="flex align-center gap-2 -mt-1">
                  <div class="text-sm font-bold mt-1">for </div>
                  <div class="text-2xl font-bold text-yellow-600">
                    {{ new Intl.NumberFormat().format(price) }}€
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-between gap-2">
              <button
                @click="amount += 1"
                type="button"
                class="inline-flex items-center justify-center bg-neutral-800 rounded-md text-sm font-medium transition-colors border border-input hover:bg-neutral-700 hover:text-accent-foreground px-2 py-1 w-1/4">
                +1
              </button>
              <button
                @click="amount += 10"
                type="button"
                class="inline-flex items-center justify-center bg-neutral-800 rounded-md text-sm font-medium transition-colors border border-input hover:bg-neutral-700 hover:text-accent-foreground px-2 py-1 w-1/4">
                +10
              </button>
              <button
                @click="amount += 100"
                type="button"
                class="inline-flex items-center justify-center bg-neutral-800 rounded-md text-sm font-medium transition-colors border border-input hover:bg-neutral-700 hover:text-accent-foreground px-2 py-1 w-1/4">
                +100
              </button>
              <button
                @click="amount = shop.item.item.amount"
                type="button"
                class="inline-flex items-center justify-center bg-neutral-800 rounded-md text-sm font-medium transition-colors border border-input hover:bg-neutral-700 hover:text-accent-foreground px-2 py-1 w-1/4">
                ALL
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-4 flex gap-2">
      <button
        @click="submit"
        type="button"
        class="rounded bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 transition-all">
        {{ shop.action === "buy" ? 'Purchase' : 'Sell' }}
      </button>

      <button @click="shop.cancel" type="button" class="rounded px-4 py-2 text-sm font-medium hover:drop-shadow-glow">
        No, go back
      </button>
    </div>
  </div>
</template>
