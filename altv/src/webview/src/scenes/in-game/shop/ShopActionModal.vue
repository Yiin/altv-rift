<script setup lang="ts">
import { computed } from "vue";
import { getItemDescription, getItemName, type Item } from "@shared/modules/items";
import type { InventoryItem } from "@shared/interfaces";
import { useQuantity } from "@/composables/use-quantity";
import { getItemGradeTextColor, getItemImage } from "@/lib/utils";
import ShopItemIcon from "./ShopItemIcon.vue";
import { canBuy } from "./shop.utils";

const props = defineProps<{
  item: Item;
  price: number | null;
  slot: number;
}>();

const emit = defineEmits<{
  close: [];
  submit: [item: InventoryItem, amount: number];
}>();

const maxAmount = computed(() => canBuy(props));

const {
  quantity,
  handleQuantityInput,
  handleQuantityKeydown,
  handleQuantityPaste,
  canIncrease,
  canDecrease,
} = useQuantity({
  min: 0,
  max: maxAmount,
});

const price = computed(() => quantity.value * (props.price ?? 0));
</script>

<template>
  <div
    class="absolute left-0 top-0 z-max flex h-full w-full items-center justify-center bg-black/35 backdrop-blur-xs"
  >
    <div
      class="group relative flex w-65 flex-col bg-neutral-900 pb-6"
      v-click-outside="() => emit('close')"
    >
      <ShopItemIcon
        :id="slot + (1337 || 'so svg filters can work correctly')"
        :image-url="getItemImage(item.key)"
      />
      <div class="mt-1 flex min-h-0 flex-col items-start gap-2 px-6 py-4 text-center">
        <div class="flex w-full flex-col items-start gap-1">
          <div
            class="w-full text-xs font-bold uppercase"
            :class="['grade' in item ? getItemGradeTextColor(item.grade) : 'invisible']"
          >
            {{ "grade" in item ? item.grade : "" }}
          </div>
          <div class="w-full font-extrabold uppercase text-white">
            {{ getItemName(item.key) }}
          </div>
        </div>
        <div class="w-full text-sm font-bold text-zinc-400">
          {{ getItemDescription(item.key) }}
        </div>
        <div class="my-1 -ml-2 w-full text-lg font-extrabold uppercase text-lime-400">
          $ {{ price }}
        </div>
        <div class="relative flex flex-col items-start gap-2 px-8">
          <div
            class="mt-1 flex items-center justify-between rounded-md border border-solid border-neutral-400/10 bg-neutral-400/5 py-2"
          >
            <div
              @click="quantity--"
              class="-mt-1 cursor-pointer px-4 text-3xl leading-[0]"
              :class="[canDecrease ? 'text-white' : 'text-gray-500']"
            >
              -
            </div>
            <input
              class="leading-0 block w-full border-none bg-none text-center text-xl text-white focus-visible:outline-hidden"
              :value="quantity"
              @input="handleQuantityInput"
              @keydown="handleQuantityKeydown"
              @paste="handleQuantityPaste"
              autofocus
            />
            <div
              @click="quantity++"
              class="-mt-1 cursor-pointer px-4 text-3xl leading-[0]"
              :class="[canIncrease ? 'text-white' : 'text-gray-500']"
            >
              +
            </div>
          </div>
          <div
            v-if="quantity > 1"
            @click="() => (quantity = 1)"
            class="absolute -left-2.5 top-4 cursor-pointer rounded bg-slate-300/10 px-1 py-3 text-[0.8275rem] font-extrabold uppercase leading-[0] text-lime-400 hover:bg-slate-300/20"
          >
            One
          </div>
          <div
            v-if="quantity !== maxAmount"
            @click="() => (quantity = maxAmount)"
            class="absolute -right-2.5 top-4 cursor-pointer rounded bg-slate-300/10 px-1 py-3 text-[0.8275rem] font-extrabold uppercase leading-[0] text-lime-400 hover:bg-slate-300/20"
          >
            Max
          </div>
          <div
            class="flex w-full cursor-pointer items-center justify-center border border-white/10 bg-white/5 px-8 py-2.5 transition-all duration-75 hover:bg-passionateRubyBlaze2"
            @click="() => emit('submit', { item, slot, price }, quantity)"
          >
            <div class="text-sm font-extrabold uppercase text-white">
              {{ canBuy(props) ? "purchase" : "not enough money" }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
