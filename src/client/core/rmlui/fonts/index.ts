import alt from "@altv/client";
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
    const rcssFontName = `${normalizedFontName}-${variant.toLowerCase()}`;

    alt.log(`Loading font ${rcssFontName} from ${font.name}-${variant}`);

    alt.loadRmlFontFace(
      join(__relativedirname, `${normalizedFontName}/${font.name}-${variant}.ttf`),
      rcssFontName,
      variant.endsWith("Italic") ? true : undefined,
    );
  }
}

if (alt.isDebug) {
  alt.logWarning(`Registering a font twice is normal with reconnect.`);
}
