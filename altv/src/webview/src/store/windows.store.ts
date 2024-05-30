import { defineStore } from "pinia";

export const useWindows = defineStore("windows", {
  state: () => ({
    topIndex: 0,
  }),
});
