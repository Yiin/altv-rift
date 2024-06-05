import { defineStore } from "pinia";

export const useVehshop = defineStore("vehicle-shop", {
  state: (): any => ({
    carTypes: ["pickups", "sedans", "vans", "sport cars", "motorcycle", "imports"],
    sections: [{ value: 25 }, { value: 25 }],
    selectedCarType: "pickups",
    carInfo: [
      {
        modelMain: "Audi RS 7",
        modelSub: "DBS SUPERLEGGERA",
        price: "$ 22 518 655",
        manufacturer: "audi",
        maxSpeed: "324",
        acceleration: "77",
        breaking: "37",
        weight: "3521",
      },
      {
        modelMain: "ASTON MARTIN",
        modelSub: "Sportback 2013",
        price: "$ 5 518 655",
        manufacturer: "aston-martin",
        maxSpeed: "250",
        acceleration: "99",
        breaking: "30",
        weight: "2521",
      },
      {
        modelMain: "BMW",
        modelSub: "M4 COUPE",
        price: "$ 5 518 655",
        manufacturer: "bmw",
        maxSpeed: "250",
        acceleration: "99",
        breaking: "30",
        weight: "2521",
      },
      {
        modelMain: "BMW",
        modelSub: "M3 2013",
        price: "$ 5 518 655",
        manufacturer: "bmw",
        maxSpeed: "250",
        acceleration: "99",
        breaking: "30",
        weight: "2521",
      },
      {
        modelMain: "MERCEDES",
        modelSub: "AMG C 63 S COUPE",
        price: "$ 5 518 655",
        manufacturer: "mercedes",
        maxSpeed: "250",
        acceleration: "99",
        breaking: "30",
        weight: "2521",
      },
      {
        modelMain: "NISSAN",
        modelSub: "GT-R (2017)",
        price: "$ 5 518 655",
        manufacturer: "nissan",
        maxSpeed: "250",
        acceleration: "99",
        breaking: "30",
        weight: "2521",
      },
      {
        modelMain: "BMW",
        modelSub: "M3 2013",
        price: "$ 5 518 655",
        manufacturer: "bmw",
        maxSpeed: "250",
        acceleration: "99",
        breaking: "30",
        weight: "2521",
      },
    ],
    selectedCarInfo: {
      modelMain: "Audi RS 7",
      modelSub: "DBS SUPERLEGGERA",
      price: "$ 22 518 655",
      manufacturer: "audi",
      maxSpeed: "324",
      acceleration: "77",
      breaking: "37",
      weight: "3521",
    },
  }),
  actions: {
    selectCarType(carType: string): void {
      this.selectedCarType = carType;
    },
    selectCar(carInfo: any): void {
      this.selectedCarInfo = carInfo;
    },
  },
});
