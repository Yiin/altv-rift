<script setup lang="ts">
import { computed, ref } from "vue";
import {
  getItemName,
  isStackable,
  getItemCategoryName,
  getItemDescription,
} from "@shared/modules/items";
import { ItemSourceOrigin } from "@shared/interfaces";
import { type TransferingAmount, useInventory } from "@/store/inventory.store";
import { useFloatingStyles } from "@/composables/use-floating-styles";
import { useQuantity } from "@/composables/use-quantity";
import ItemIcon from "./ItemIcon.vue";

const props = defineProps<TransferingAmount>();

const { confirmAmountTransfer, cancelAmountTransfer } = useInventory();
const totalAmount = computed(() => {
  if (isStackable(props.item.item)) {
    return props.item.item.amount;
  }
  return 1;
});

const { quantity, handleQuantityInput, handleQuantityKeydown, handleQuantityPaste } = useQuantity({
  min: 1,
  max: totalAmount.value,
});

const isDropping = computed(() => !props.to || props.to.origin === ItemSourceOrigin.Ground);

const { floatingStyles, floatingRef } = useFloatingStyles(props.position);
</script>

<template>
  <div
    ref="floatingRef"
    v-click-outside="cancelAmountTransfer"
    :style="floatingStyles"
    class="drop-shadow-xl"
  >
    <div class="items-start justify-start gap-2.5 bg-white p-5">
      <div class="flex items-center justify-between">
        <div class="text-base font-bold uppercase text-black">
          {{ isDropping ? "You're dropping" : "You're transfering" }}
        </div>

        <div
          class="cursor-pointer"
          @click="cancelAmountTransfer"
        >
          <img
            class="pointer-events-none"
            src="/assets/inventory/modal-close-icon.svg"
          />
        </div>
      </div>
      <div class="my-2.75 flex w-full items-center justify-start">
        <ItemIcon
          :item="props.item.item"
          height="4.0625rem"
          width="4.0625rem"
          hide-amount
        />
        <div class="flex flex-grow flex-col gap-0.5">
          <div class="text-sm font-semibold uppercase leading-none text-zinc-500">
            {{ getItemCategoryName(item.item.key) }}
          </div>
          <div class="text-base font-semibold uppercase leading-none text-black">
            {{ getItemName(item.item.key) }}
          </div>
        </div>
        <div class="items-center justify-end">
          <div>
            <div class="bg-main-400 p-2 text-sm font-extrabold leading-none text-white">
              x {{ totalAmount }}
            </div>
          </div>
        </div>
      </div>
      <div class="mb-5.5 max-w-56 text-sm font-semibold uppercase text-zinc-500">
        {{ getItemDescription(item.item.key) }}
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex gap-1.25">
          <input
            class="flex h-12.5 w-full items-center justify-start bg-neutral-100 px-5 text-base font-extrabold uppercase text-black"
            v-model="quantity"
            @input="handleQuantityInput"
            @keydown="handleQuantityKeydown"
            @paste="handleQuantityPaste"
          />
          <div
            class="flex h-12.5 w-12.5 flex-shrink-0 cursor-pointer items-center justify-center bg-main-400 text-white hover:bg-main-300"
            @click.stop="() => confirmAmountTransfer(quantity)"
          >
            <img src="/assets/inventory/transfer-icon.svg" />
          </div>
        </div>
        <div
          @click.stop="() => confirmAmountTransfer(totalAmount)"
          class="flex h-12.5 w-full cursor-pointer items-center justify-center gap-2.5 bg-zinc-900 hover:bg-zinc-800"
        >
          <div class="text-center text-sm font-extrabold uppercase text-white">
            {{ isDropping ? "Drop" : "Transfer" }} all
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
../../../composables/use-quantity
