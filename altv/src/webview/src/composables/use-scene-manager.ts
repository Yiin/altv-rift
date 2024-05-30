import { useRouter } from "vue-router";
import { useAlt } from "./use-alt";

export const useSceneManager = () => {
  const router = useRouter();
  const { on } = useAlt();

  on("scene:Change", (newScene: string) => {
    router.replace(newScene);
  });
};
