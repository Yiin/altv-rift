<script setup lang="ts">
import { useVehshop } from "@/store/vehshop.store"
import Icon from "../../../components/Icon/Icon.vue";
import Donut from "./Donut.vue";
import DarkBackground from "../../../components/DarkBackground.vue"
import BackButtons from "../../../components/buttons/BackButtons.vue"

const vehshop = useVehshop()

const selectCarType = (carType) => {
  vehshop.selectCarType(carType);
};

const selectCar = (car) => {
  vehshop.selectCar(car);
};

</script>

<template>
  <div class="relative w-full h-full px-20 py-11 flex flex-col justify-between">
    <DarkBackground />
    <div class="flex w-full mx-auto justify-between items-center">
      <div class="w-40"> <v-img :src="`./assets/vehicles/logo.png`" /></div>
      <div
        class="flex gap-2.5 text-white font-bold text-base overflow-x-auto whitespace-nowrap mx-20 disableScrollBar">
        <button v-for="item in  vehshop.carTypes " :key="item" @click="selectCarType(item)"
          class="px-11 py-3 border border-solid rounded-md border-white/30 uppercase"
          :class="{
        'bg-sunriseYellow text-black shadow-sunriseYellow': item === vehshop.selectedCarType,
        'hover:bg-white/10 transition duration-200': item !== vehshop.selectedCarType
      }">
          {{ item }}
        </button>
      </div>
      <BackButtons />
    </div>
    <div class="flex justify-between items-center">
      <div class="flex flex-col gap-5 w-52">
        <div class="text-white text-5xl font-extrabold">{{ vehshop.selectedCarInfo.modelMain }}</div>
        <div>
          <div class="text-white/50 text-2xl">PRICE</div>
          <div class="text-sunriseYellow text-4xl font-extrabold">{{ vehshop.selectedCarInfo.price }}</div>
        </div>
        <div class="flex flex-col gap-2">
          <button
            class="uppercase text-sm font-bold text-black py-3 border-1 border-sunriseYellow border-solid rounded-md bg-sunriseYellow hover:bg-sunriseYellow/80 transition duration-200">Buy
            car</button>
          <button
            class="uppercase text-sm font-bold text-white py-3 border border-solid border-white/10 hover:bg-white/10 transition duration-200">Test
            drive</button>
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <Donut :percent="(vehshop.selectedCarInfo.maxSpeed * 100) / 500" label="maxSpeed"
          :value="`${vehshop.selectedCarInfo.maxSpeed} km/h`" />
        <Donut :percent="vehshop.selectedCarInfo.acceleration" label="acceleration"
          :value="`${vehshop.selectedCarInfo.acceleration} %`" />
        <Donut :percent="vehshop.selectedCarInfo.breaking" label="breaking"
          :value="`${vehshop.selectedCarInfo.breaking} %`" />
        <Donut :percent="(vehshop.selectedCarInfo.weight * 100) / 10000" label="weight"
          :value="`${vehshop.selectedCarInfo.weight} kg`" />
      </div>
    </div>
    <div class="flex w-full gap-1 overflow-x-scroll">
      <div v-for="item in vehshop.carInfo" :key="item" @click="selectCar(item)"
        class="cursor-pointer flex flex-col justify-end">
        <div class="flex w-80 bg-sunriseYellow h-1"></div>
        <div
          class="flex w-80 flex-col justify-between bg-black/80 px-8 py-6 transition hover:bg-sunriseYellowToBlack duration-400"
          :class="{ 'h-64 bg-sunriseYellowToBlack': item.modelSub === vehshop.selectedCarInfo.modelSub }">
          <div v-if="item.modelSub === vehshop.selectedCarInfo.modelSub">
            <v-img :src="`./assets/vehicles/${item.manufacturer}.png`" class="h-20" />
          </div>
          <div class="flex justify-between w-full">
            <div class="flex flex-col">
              <div class="text-white text-xl font-bold">{{ item.modelMain }}</div>
              <div class="text-sunriseYellow text-base mb-4">{{ item.modelSub }}</div>
              <div class="text-white text-xl font-bold">{{ item.price }}</div>
            </div>
            <Icon :name="item.manufacturer" :width="4" :height="2.5" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.disableScrollBar {
  -ms-overflow-style: none;
  /* Internet Explorer 10+ */
  scrollbar-width: none;
  /* Firefox */
}

.disableScrollBar::-webkit-scrollbar {
  display: none;
  /* Safari and Chrome */
}
</style>
