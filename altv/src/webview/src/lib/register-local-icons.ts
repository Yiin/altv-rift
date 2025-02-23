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
async function processAndRegisterIcons(prefix: string, icons: Record<string, unknown>) {
  const iconSet: Record<string, IconifyIcon> = {};
  let processedCount = 0;

  for (const path in icons) {
    try {
      // Extract name while preserving directory structure
      const pathParts = path.split("/");
      const name = pathParts[pathParts.length - 1].replace(".svg", "");
      if (!name) continue;

      const svgContent = icons[path] as string;
      if (!svgContent) {
        console.warn(`Empty SVG content for ${path}`);
        continue;
      }

      const icon = convertSvgToIcon(svgContent);
      if (icon) {
        iconSet[name] = icon;
        processedCount++;
      }
    } catch (error) {
      console.error(`Failed to process icon at ${path}:`, error);
    }
  }

  if (processedCount === 0) {
    console.warn(
      `No icons were processed for prefix "${prefix}". Check if SVG files exist and are accessible.`,
    );
    return;
  }

  console.log(`Successfully processed ${processedCount} icons for prefix "${prefix}"`);

  addCollection({
    prefix,
    icons: iconSet,
  });
}

// Initialize all icon collections
export async function initializeLocalIcons() {
  try {
    const isDev = import.meta.env.DEV;

    if (isDev) {
      // In development, use the glob imports
      await processAndRegisterIcons(
        "local",
        import.meta.glob("../assets/generic/*.svg", {
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
    } else {
      // In production, import all SVGs directly
      const genericIcons = import.meta.glob("../assets/generic/*.svg", {
        query: "?url",
        import: "default",
        eager: true,
      });

      const clothingShopIcons = import.meta.glob("../assets/clothing-shop/*.svg", {
        query: "?url",
        import: "default",
        eager: true,
      });

      // Process generic icons
      const genericIconsContent: Record<string, unknown> = {};
      for (const [path, url] of Object.entries(genericIcons)) {
        try {
          const response = await fetch(url as string);
          const svgContent = await response.text();
          genericIconsContent[path] = svgContent;
        } catch (error) {
          console.error(`Failed to fetch icon at ${path}:`, error);
        }
      }
      await processAndRegisterIcons("local", genericIconsContent);

      // Process clothing shop icons
      const clothingIconsContent: Record<string, unknown> = {};
      for (const [path, url] of Object.entries(clothingShopIcons)) {
        try {
          const response = await fetch(url as string);
          const svgContent = await response.text();
          clothingIconsContent[path] = svgContent;
        } catch (error) {
          console.error(`Failed to fetch icon at ${path}:`, error);
        }
      }
      await processAndRegisterIcons("clothing-shop", clothingIconsContent);
    }

    console.log("All icon collections initialized successfully");
  } catch (error) {
    console.error("Failed to initialize icon collections:", error);
    throw error;
  }
}
