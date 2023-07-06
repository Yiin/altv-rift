import alt from "alt-client";
import { join } from "@shared/utility/path";

const googleFonts = [
  {
    name: "Inter",
    variants: [
      "Black",
      "Bold",
      "ExtraBold",
      "ExtraLight",
      "Light",
      "Medium",
      "Regular",
      "SemiBold",
      "Thin",
    ],
  },
  {
    name: "JosefinSans",
    variants: [
      "Bold",
      "BoldItalic",
      "ExtraLight",
      "ExtraLightItalic",
      "Italic",
      "Light",
      "LightItalic",
      "Medium",
      "MediumItalic",
      "Regular",
      "SemiBold",
      "SemiBoldItalic",
      "Thin",
      "ThinItalic",
    ],
  },
];

for (const font of googleFonts) {
  const normalizedFontName = font.name.toLowerCase();

  for (const variant of font.variants) {
    alt.log(`Loading font ${normalizedFontName} from ${font.name}-${variant}`);
    alt.loadRmlFont(
      join(
        __relativedirname,
        `${normalizedFontName}/${font.name}-${variant}.ttf`
      ),
      normalizedFontName,
      variant.endsWith("Italic") ? true : undefined
    );
  }
}

if (alt.debug) {
  alt.logWarning(`Registering a font twice is normal with reconnect.`);
}
