import { useRouter } from "vue-router";

export const useSceneManager = () => {
  const router = useRouter();

  alt.on("scene:Change", (newScene: string) => {
    router.replace(newScene);
  });
};
