import { ref, onMounted, watch } from "vue";
import ColorThief from "colorthief";

export function useGlowEffect(imageUrl: string) {
  const imgRef = ref<HTMLImageElement | null>(null);
  const dominantColor = ref<string>("rgba(0, 0, 0, 0)");

  const getColorFromImage = () => {
    if (imgRef.value) {
      const colorThief = new ColorThief();
      imgRef.value.onload = () => {
        const color = colorThief.getColor(imgRef.value!);

        if (color) {
          dominantColor.value = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        }
      };
    }
  };

  onMounted(() => {
    getColorFromImage();
  });

  watch(() => imageUrl, getColorFromImage);

  return {
    imgRef,
    dominantColor,
  };
}
