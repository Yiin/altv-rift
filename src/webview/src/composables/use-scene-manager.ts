
import { useRouter } from 'vue-router';

export const useSceneManager = () => {
  const router = useRouter()

  if ('alt' in window) {
    alt.on('scene:Change', (newScene: string) => {
      router.replace(newScene);
    });
  } else {
    router.push('/create-character');
  }
}