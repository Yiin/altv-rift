import { computed, reactive, watchEffect } from "vue";
import { UIElement } from "@shared/enums/ui";
import { clientState } from "@/core/store/client.store";
import { doesElementHaveCursor } from "../../webview";
import { ActionRegistration } from "./types";

const registeredActions: ActionRegistration[] = reactive([]);

export function registerActions(action: ActionRegistration) {
  registeredActions.push(action);
}

export const actions = computed(() => registeredActions.map((action) => action()).flat());

watchEffect(() => {
  clientState.actionMenu = actions.value.map(({ item }) => item);
});

doesElementHaveCursor.hook((element) => {
  if (element !== UIElement.ACTION_MENU) {
    return;
  }
  return true;
});
