import { defineStore } from "pinia";

interface State {
  isLoggedIn: boolean;
}

export const useTestStore = defineStore("test", {
  state: (): State => ({
    isLoggedIn: false,
  }),
  actions: {
    login() {
      this.isLoggedIn = true;
    },
  },
});
