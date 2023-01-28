import Menu from "./Menu.vue";
import Parents from "./Parents.vue";
import Features from "./Features.vue";
import Appearance from "./Appearance.vue";
import CreateCharacterScene from "./CreateCharacterScene.vue";

export const createCharacterRoute = {
  path: "/create-character",
  component: CreateCharacterScene,
  children: [
    { path: "", name: "CreateCharacter", exact: true, component: Menu },
    {
      path: "parents",
      name: "CreateCharacter.Parents",
      component: Parents,
    },
    {
      path: "features",
      name: "CreateCharacter.Features",
      component: Features,
    },
    {
      path: "appearance",
      name: "CreateCharacter.Appearance",
      component: Appearance,
    },
  ],
};
