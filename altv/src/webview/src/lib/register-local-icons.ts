import { addCollection, type IconifyIcon } from "@iconify/vue";

// Function to convert SVG content to Iconify format
function convertSvgToIcon(svgContent: string): IconifyIcon | null {
  try {
    // Extract viewBox from SVG
    const viewBoxMatch = svgContent.match(/viewBox=["']([^"']+)["']/);
    const viewBox = viewBoxMatch ? viewBoxMatch[1].split(" ").map(Number) : [0, 0, 24, 24];

    // Clean up SVG content - remove outer svg tags and keep only the content
    const bodyMatch = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
    const body = bodyMatch ? bodyMatch[1].trim() : svgContent;

    return {
      body,
      width: viewBox[2],
      height: viewBox[3],
    };
  } catch (error) {
    console.error("Failed to convert SVG:", error);
    return null;
  }
}

// Process icons from a glob result and register them with a prefix
async function processAndRegisterIcons(prefix: string, globResult: Record<string, unknown>) {
  const iconSet: Record<string, IconifyIcon> = {};

  for (const path in globResult) {
    const name = path.split("/").pop()?.replace(".svg", "");
    if (!name) continue;

    const svgContent = globResult[path] as string;
    const icon = convertSvgToIcon(svgContent);
    if (icon) {
      iconSet[name] = icon;
    }
  }

  addCollection({
    prefix,
    icons: iconSet,
  });
}

// Initialize all icon collections
export async function initializeLocalIcons() {
  // Register each collection
  await processAndRegisterIcons(
    "local",
    import.meta.glob("../assets/icons/*.svg", {
      query: "?raw",
      import: "default",
      eager: true,
    }),
  );

  await processAndRegisterIcons(
    "clothing-shop",
    import.meta.glob("../assets/clothing-shop/*.svg", {
      query: "?raw",
      import: "default",
      eager: true,
    }),
  );

  // Add more collections as needed:
  // const vehicleIcons = import.meta.glob("../../public/assets/vehicles/*.svg", ...);
  // await processAndRegisterIcons(vehicleIcons, "vehicle");
}
