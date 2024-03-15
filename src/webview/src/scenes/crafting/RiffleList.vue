<script setup lang="ts">
import { type RifleType } from "./types";

const props = defineProps({
  rifles: Array<RifleType>,
});
</script>

<template>
  <div class="max-w-full lg:absolute lg:h-full lg:max-w-[300px]">
    <div class="w-full">
      <button
        id="dropdownDefaultButton"
        data-dropdown-toggle="dropdown"
        class="mb-2.5 flex w-full items-center justify-between rounded-md border border-solid border-white/10 bg-transparent px-5 py-4 text-center text-base font-bold text-white"
        type="button"
      >
        <div class="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="11"
            viewBox="0 0 16 11"
            fill="none"
          >
            <path
              d="M4.4058 0.6875H16V3.4375H15.2754V4.125H10.9275C10.7354 4.125 10.551 4.19743 10.4151 4.32636C10.2792 4.4553 10.2029 4.63016 10.2029 4.8125V5.5C10.2029 5.86467 10.0502 6.21441 9.77842 6.47227C9.50662 6.73013 9.13799 6.875 8.75362 6.875H6.30435C6.02899 6.875 5.77536 7.02625 5.65217 7.26L3.87681 10.6219C3.75362 10.8556 3.50725 11 3.23188 11H0.782609C0.782609 11 -1.3913 11 1.50725 6.875C1.50725 6.875 3.68116 4.125 0.782609 4.125V0.6875H1.50725L1.86957 0H4.04348L4.4058 0.6875ZM9.47826 5.5V4.8125C9.47826 4.63016 9.40191 4.4553 9.26602 4.32636C9.13012 4.19743 8.94581 4.125 8.75362 4.125H8.02899C8.02899 4.125 7.30435 4.8125 8.02899 5.5C7.64461 5.5 7.27599 5.35513 7.00419 5.09727C6.7324 4.83941 6.57971 4.48967 6.57971 4.125C6.38752 4.125 6.20321 4.19743 6.06731 4.32636C5.93142 4.4553 5.85507 4.63016 5.85507 4.8125V5.5C5.85507 5.68234 5.93142 5.8572 6.06731 5.98614C6.20321 6.11507 6.38752 6.1875 6.57971 6.1875H8.75362C8.94581 6.1875 9.13012 6.11507 9.26602 5.98614C9.40191 5.8572 9.47826 5.68234 9.47826 5.5Z"
              fill="white"
            ></path>
          </svg>
          <p>Rifles</p>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="8"
          height="6"
          viewBox="0 0 8 6"
          fill="none"
        >
          <path
            d="M0.5 1L4 4.5L7.5 1"
            stroke="white"
            stroke-linecap="round"
          ></path>
        </svg>
      </button>
    </div>
    <div
      class="rifles relative flex h-[calc(100vh_-_213px)] w-full snap-y snap-mandatory flex-col gap-2.5 overflow-y-auto pl-3"
      dir="rtl"
    >
      <div
        v-for="rifle in props.rifles"
        :key="rifle.name"
        class="snap-start lg:w-full"
        dir="ltr"
        :class="
          rifle.isActive
            ? 'rounded-md bg-white/5 px-6 pb-6 pt-7'
            : 'rounded-md border border-solid border-white/10 bg-transparent px-6 pb-6 pt-7'
        "
      >
        <div>
          <img
            :src="rifle.image"
            :alt="rifle.name"
            class="w-full"
          />
        </div>
        <div>
          <span
            :class="[
              `inline-block rounded-sm px-2 py-1 text-xs font-extrabold uppercase text-white`,
              rifle.tag.bgCol,
            ]"
          >
            {{ rifle.tag.text }}
          </span>
          <h3 class="mt-0.5 text-[20px] font-bold text-white">
            {{ rifle.name }}
          </h3>
          <p class="text-sm text-steelGray">{{ rifle.ammo }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
