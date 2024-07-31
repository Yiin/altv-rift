import { ref, type Ref } from "vue";
import { asset } from "@/lib/utils";

const svgCache: { [key: string]: Ref<string | null> } = {};

export function useSvgIcon(name: string) {
  const fetchSvg = async (name: string) => {
    svgCache[name] = ref(null);

    const response = await fetch(asset(`assets/icons/${name}.svg`));
    const text = await response.text();
    svgCache[name].value = text;
  };

  fetchSvg(name);

  if (name in svgCache === false) {
    fetchSvg(name);
  }

  return svgCache[name];
}
