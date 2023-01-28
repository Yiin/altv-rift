import { OverlayType } from "./overlays";

export const hairColors = [
  { hex: "#1c1f21" },
  { hex: "#272a2c" },
  { hex: "#312e2c" },
  { hex: "#35261c" },
  { hex: "#4b321f" },
  { hex: "#5c3b24" },
  { hex: "#6d4c35" },
  { hex: "#6b503b" },
  { hex: "#765c45" },
  { hex: "#7f684e" },
  { hex: "#99815d" },
  { hex: "#a79369" },
  { hex: "#af9c70" },
  { hex: "#bba063" },
  { hex: "#d6b97b" },
  { hex: "#dac38e" },
  { hex: "#9f7f59" },
  { hex: "#845039" },
  { hex: "#682b1f" },
  { hex: "#61120c" },
  { hex: "#640f0a" },
  { hex: "#7c140f" },
  { hex: "#a02e19" },
  { hex: "#b64b28" },
  { hex: "#a2502f" },
  { hex: "#aa4e2b" },
  { hex: "#626262" },
  { hex: "#808080" },
  { hex: "#aaaaaa" },
  { hex: "#c5c5c5" },
  { hex: "#463955" },
  { hex: "#5a3f6b" },
  { hex: "#763c76" },
  { hex: "#ed74e3" },
  { hex: "#eb4b93" },
  { hex: "#f299bc" },
  { hex: "#04959e" },
  { hex: "#025f86" },
  { hex: "#023974" },
  { hex: "#3fa16a" },
  { hex: "#217c61" },
  { hex: "#185c55" },
  { hex: "#b6c034" },
  { hex: "#70a90b" },
  { hex: "#439d13" },
  { hex: "#dcb857" },
  { hex: "#e5b103" },
  { hex: "#e69102" },
  { hex: "#f28831" },
  { hex: "#fb8057" },
  { hex: "#e28b58" },
  { hex: "#d1593c" },
  { hex: "#ce3120" },
  { hex: "#ad0903" },
  { hex: "#880302" },
  { hex: "#1f1814" },
  { hex: "#291f19" },
  { hex: "#2e221b" },
  { hex: "#37291e" },
  { hex: "#2e2218" },
  { hex: "#231b15" },
  { hex: "#020202" },
  { hex: "#706c66" },
  { hex: "#9d7a50" },
];

export const blushColors = new Map([
  [9, "Pale"],
  [11, "Light Brown"],
  [12, "Brown"],
  [13, "Orange"],
  [14, "Pink"],
  [15, "Light Pink"],
  [16, "Anime"],
]);

export const overlayColors = [
  { name: "Red", hex: "#992532" },
  { name: "Pink", hex: "#c8395d" },
  { name: "Light Pink", hex: "#bd516c" },
  { name: "Lighter Pink", hex: "#b8637a" },
  { name: "Lightest Pink", hex: "#a6526b" },
  { name: "Light Maroon", hex: "#b1434c" },
  { name: "Maroon", hex: "#7f3133" },
  { name: "Light Brown", hex: "#a4645d" },
  { name: "Lighter Brown", hex: "#c18779" },
  { name: "Lightest Brown", hex: "#cba096" },
  { name: "White Pink", hex: "#c6918f" },
  { name: "Beige", hex: "#ab6f63" },
  { name: "Brown Red", hex: "#b06050" },
  { name: "Orange", hex: "#a84c33" },
  { name: "Orange Pink", hex: "#b47178" },
  { name: "Lightest Pink", hex: "#ca7f92" },
  { name: "Lighter Pink", hex: "#ed9cbe" },
  { name: "Pink", hex: "#e775a4" },
  { name: "Vibrant Pink", hex: "#de3e81" },
  { name: "Dark Pink", hex: "#b34c6e" },
  { name: "Darker Pink", hex: "#712739" },
  { name: "Darkest Pink", hex: "#4f1f2a" },
  { name: "Red", hex: "#aa222f" },
  { name: "Lighter Red", hex: "#de2034" },
  { name: "Vibrant Red", hex: "#cf0813" },
  { name: "Red Pink", hex: "#e55470" },
  { name: "Purple", hex: "#dc3fb5" },
  { name: "Light Purple", hex: "#c227b2" },
  { name: "Dark Purple", hex: "#a01ca9" },
  { name: "Darker Purple", hex: "#6e1875" },
  { name: "Darkest Purple", hex: "#731465" },
  { name: "Vibrant Purple", hex: "#56165c" },
  { name: "Black Purple", hex: "#6d1a9d" },
  { name: "Blue", hex: "#1b3771" },
  { name: "Light Blue", hex: "#1d4ea7" },
  { name: "Lighter Blue", hex: "#1e74bb" },
  { name: "Lightest Blue", hex: "#21a3ce" },
  { name: "Cyan", hex: "#25c2d2" },
  { name: "Sea Green", hex: "#23cca5" },
  { name: "Deep Sea Green", hex: "#27c07d" },
  { name: "Green", hex: "#1b9c32" },
  { name: "Dark Green", hex: "#148604" },
  { name: "Light Green", hex: "#70d041" },
  { name: "Yellow Green", hex: "#c5ea34" },
  { name: "Dark Yellow", hex: "#e1e32f" },
  { name: "Yellow", hex: "#ffdd26" },
  { name: "Yellow Orange", hex: "#fac026" },
  { name: "Dark Yellow Orange", hex: "#f78a27" },
  { name: "Vigrant Orange", hex: "#fe5910" },
  { name: "Dark Orange", hex: "#be6e19" },
  { name: "Blonde", hex: "#f7c97f" },
  { name: "Blonde White", hex: "#fbe5c0" },
  { name: "White", hex: "#f5f5f5" },
  { name: "Gray", hex: "#b3b4b3" },
  { name: "Dark Gray", hex: "#919191" },
  { name: "Darkest Gray", hex: "#564e4e" },
  { name: "Black", hex: "#180e0e" },
  { name: "Light Blue", hex: "#58969e" },
  { name: "Dark Blue", hex: "#4d6f8c" },
  { name: "Darkest Blue", hex: "#1a2b55" },
  { name: "Light Brown", hex: "#a07e6b" },
  { name: "Brown", hex: "#826355" },
  { name: "Dark Brown", hex: "#6d5346" },
  { name: "Darker Brown", hex: "#3e2d27" },
];

function makeList(...items: string[]) {
  items[255] = "None";
  return new Map(
    items
      .map((value, id) => [id, value] as const)
      .filter(([, value]) => typeof value !== "undefined")
  );
}

export enum Aspect {
  Hair = "Hair",
  Eyebrows = "Eyebrows",
  FacialHair = "Facial hair",
  ChestHair = "Chest hair",
  SkinBlemishes = "Skin blemishes",
  BodyBlemishes = "Body blemishes",
  Aging = "Aging",
  Blush = "Blush",
  SkinComplextion = "Skin complextion",
  MolesAndFreckles = "Moles and freckles",
  SunDamage = "Sun damage",
  EyeColor = "Eye color",
  EyeMakeup = "Eye makeup",
  Lipstick = "Lipstick",
}

// prettier-ignore
export const aspects = (sex: 0 | 1 = 0) => ({
  [Aspect.Hair]: {
    options: new Map<number, { name: string, collection: string, overlay: string }>(([
      // Male
      [
          [0, { name: 'Close Shave', collection: 'mpbeach_overlays', overlay: 'FM_Hair_Fuzz'}],
          [1, { name: 'Buzzcut', collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_001'}],
          [2, { name: 'Faux Hawk', collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_002'}],
          [3, { name: 'Hipster', collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_003'}],
          [4, { name: 'Side Parting', collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_004'}],
          [5, { name: 'Shorter Cut', collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_005'}],
          [6, { name: 'Biker', collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_006'}],
          [7, { name: 'Ponytail', collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_007'}],
          [8, { name: 'Cornrows', collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_008'}],
          [9, { name: 'Slicked', collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_009'}],
          [10, { name: 'Short Brushed', collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_013'}],
          [11, { name: 'Spikey', collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_002'}],
          [12, { name: 'Caesar', collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_011'}],
          [13, { name: 'Chopped', collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_012'}],
          [14, { name: 'Dreads', collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_014'}],
          [15, { name: 'Long Hair', collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_015'}],
          [16, { name: 'Shaggy Curls', collection: 'multiplayer_overlays', overlay: 'NGBea_M_Hair_000'}],
          [17, { name: 'Surfer Dude', collection: 'multiplayer_overlays', overlay: 'NGBea_M_Hair_001'}],
          [18, { name: 'Short Side Part', collection: 'multiplayer_overlays', overlay: 'NGBus_M_Hair_000'}],
          [19, { name: 'High Slicked Sides', collection: 'multiplayer_overlays', overlay: 'NGBus_M_Hair_001'}],
          [20, { name: 'Long Slicked', collection: 'multiplayer_overlays', overlay: 'NGHip_M_Hair_000'}],
          [21, { name: 'Hipster Youth', collection: 'multiplayer_overlays', overlay: 'NGHip_M_Hair_001'}],
          [22, { name: 'Mullet', collection: 'multiplayer_overlays', overlay: 'NGInd_M_Hair_000'}],
          [24, { name: 'Classic Cornrows', collection: 'mplowrider_overlays', overlay: 'LR_M_Hair_000'}],
          [25, { name: 'Palm Cornrows', collection: 'mplowrider_overlays', overlay: 'LR_M_Hair_001'}],
          [26, { name: 'Lightning Cornrows', collection: 'mplowrider_overlays', overlay: 'LR_M_Hair_002'}],
          [27, { name: 'Whipped Cornrows', collection: 'mplowrider_overlays', overlay: 'LR_M_Hair_003'}],
          [28, { name: 'Zig Zag Cornrows', collection: 'mplowrider2_overlays', overlay: 'LR_M_Hair_004'}],
          [29, { name: 'Snail Cornrows', collection: 'mplowrider2_overlays', overlay: 'LR_M_Hair_005'}],
          [30, { name: 'Hightop', collection: 'mplowrider2_overlays', overlay: 'LR_M_Hair_006'}],
          [31, { name: 'Loose Swept Back', collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_000_M'}],
          [32, { name: 'Undercut Swept Back', collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_001_M'}],
          [33, { name: 'Undercut Swept Side', collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_002_M'}],
          [34, { name: 'Spiked Mohawk', collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_003_M'}],
          [35, { name: 'Mod', collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_004_M'}],
          [36, { name: 'Layered Mod', collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_005_M'}],
          [72, { name: 'Flattop', collection: 'mpgunrunning_overlays', overlay: 'MP_Gunrunning_Hair_M_000_M'}],
          [73, { name: 'Military Buzzcut', collection: 'mpgunrunning_overlays', overlay: 'MP_Gunrunning_Hair_M_001_M'}],
      ],
  
      // Female
      [
          [0, { name: 'Close Shave', collection: 'mpbeach_overlays', overlay: 'FM_Hair_Fuzz'}],
          [1, { name: 'Short', collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_001'}],
          [2, { name: 'Layered Bob', collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_002'}],
          [3, { name: 'Pigtails', collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_003'}],
          [4, { name: 'Ponytail', collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_004'}],
          [5, { name: 'Braided Mohawk', collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_005'}],
          [6, { name: 'Braids', collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_006'}],
          [7, { name: 'Bob', collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_007'}],
          [8, { name: 'Faux Hawk', collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_008'}],
          [9, { name: 'French Twist', collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_009'}],
          [10, { name: 'Long Bob', collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_010'}],
          [11, { name: 'Loose Tied', collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_011'}],
          [12, { name: 'Pixie', collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_012'}],
          [13, { name: 'Shaved Bangs', collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_013'}],
          [14, { name: 'Top Knot', collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_014'}],
          [15, { name: 'Wavy Bob', collection: 'multiplayer_overlays', overlay: 'NG_M_Hair_015'}],
          [16, { name: 'Messy Bun', collection: 'multiplayer_overlays', overlay: 'NGBea_F_Hair_000'}],
          [17, { name: 'Pin Up Girl', collection: 'multiplayer_overlays', overlay: 'NGBea_F_Hair_001'}],
          [18, { name: 'Tight Bun', collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_007'}],
          [19, { name: 'Twisted Bob', collection: 'multiplayer_overlays', overlay: 'NGBus_F_Hair_000'}],
          [20, { name: 'Flapper Bob', collection: 'multiplayer_overlays', overlay: 'NGBus_F_Hair_001'}],
          [21, { name: 'Big Bangs', collection: 'multiplayer_overlays', overlay: 'NGBea_F_Hair_001'}],
          [22, { name: 'Braided Top Knot', collection: 'multiplayer_overlays', overlay: 'NGHip_F_Hair_000'}],
          [23, { name: 'Mullet', collection: 'multiplayer_overlays', overlay: 'NGInd_F_Hair_000'}],
          [25, { name: 'Pinched Cornrows', collection: 'mplowrider_overlays', overlay: 'LR_F_Hair_000'}],
          [26, { name: 'Leaf Cornrows', collection: 'mplowrider_overlays', overlay: 'LR_F_Hair_001'}],
          [27, { name: 'Zig Zag Cornrows', collection: 'mplowrider_overlays', overlay: 'LR_F_Hair_002'}],
          [28, { name: 'Pigtail Bangs', collection: 'mplowrider2_overlays', overlay: 'LR_F_Hair_003'}],
          [29, { name: 'Wave Braids', collection: 'mplowrider2_overlays', overlay: 'LR_F_Hair_003'}],
          [30, { name: 'Coil Braids', collection: 'mplowrider2_overlays', overlay: 'LR_F_Hair_004'}],
          [31, { name: 'Rolled Quiff', collection: 'mplowrider2_overlays', overlay: 'LR_F_Hair_006'}],
          [32, { name: 'Loose Swept Back', collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_000_F'}],
          [33, { name: 'Undercut Swept Back', collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_001_F'}],
          [34, { name: 'Undercut Swept Side', collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_002_F'}],
          [35, { name: 'Spiked Mohawk', collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_003_F'}],
          [36, { name: 'Bandana and Braid', collection: 'multiplayer_overlays', overlay: 'NG_F_Hair_003'}],
          [37, { name: 'Layered Mod', collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_006_F'}],
          [38, { name: 'Skinbyrd', collection: 'mpbiker_overlays', overlay: 'MP_Biker_Hair_004_F'}],
          [76, { name: 'Neat Bun', collection: 'mpgunrunning_overlays', overlay: 'MP_Gunrunning_Hair_F_000_F'}],
          [77, { name: 'Short Bob', collection: 'mpgunrunning_overlays', overlay: 'MP_Gunrunning_Hair_F_001_F'}],
      ],
  ] as const)[sex]),
    color1: hairColors,
    color2: hairColors,
  },
  [Aspect.Eyebrows]: {
    overlayId: OverlayType.Eyebrows,
    options: makeList('Classic', 'Balanced', 'Fashion', 'Cleopatra', 'Quizzical', 'Femme', 'Seductive', 'Pinched', 'Chola', 'Triomphe', 'Carefree', 'Curvaceous', 'Rodent', 'Double Tram', 'Thin', 'Penciled', 'Mother Plucker', 'Straight and Narrow', 'Natural', 'Fuzzy', 'Unkempt', 'Caterpillar', 'Regular', 'Mediterranean', 'Groomed', 'Bushels', 'Feathered', 'Prickly', 'Monobrow', 'Winged', 'Triple Tram', 'Arched Tram', 'Cutouts', 'Fade Away', 'Solo Tram'),
    color1: overlayColors,
    color2: overlayColors,
  },
  ...(sex === 0
    ? {
      [Aspect.FacialHair]: {
        overlayId: OverlayType.FacialHair,
        options: makeList('Classic', 'Light Stubble', 'Balbo', 'Circle Beard', 'Goatee', 'Chin', 'Chin Fuzz', 'Pencil Chin Strap', 'Scruffy', 'Musketeer', 'Mustache', 'Trimmed Beard', 'Stubble', 'Thin Circle Beard', 'Horseshoe', 'Pencil and \'Chops', 'Chin Strap Beard', 'Balbo and Sideburns', 'Mutton Chops', 'Scruffy Beard', 'Curly', 'Curly & Deep Stranger', 'Handlebar', 'Faustic', 'Otto & Patch', 'Otto & Full Stranger', 'Light Franz', 'The Hampstead', 'The Ambrose', 'Lincoln Curtain'),
        color1: overlayColors,
        color2: overlayColors,
      },
      [Aspect.ChestHair]: {
        overlayId: OverlayType.ChestHair,
        options: makeList('Classic', 'Natural', 'The Strip', 'The Tree', 'Hairy', 'Grisly', 'Ape', 'Groomed Ape', 'Bikini', 'Lightning Bolt', 'Reverse Lightning', 'Love Heart', 'Chestache', 'Happy Face', 'Skull', 'Snail Trail', 'Slug and Nips', 'Hairy Arms'),
        color1: overlayColors,
      },
    }
    : {}
  ),
  
  [Aspect.SkinBlemishes]: {
    overlayId: OverlayType.Blemishes,
    options: makeList('Classic', 'Measles', 'Pimples', 'Spots', 'Break Out', 'Blackheads', 'Build Up', 'Pustules', 'Zits', 'Full Acne', 'Acne', 'Cheek Rash', 'Face Rash', 'Picker', 'Puberty', 'Eyesore', 'Chin Rash', 'Two Face', 'T Zone', 'Greasy', 'Marked', 'Acne Scarring', 'Full Acne Scarring', 'Cold Sores', 'Impetigo'),
  },
  [Aspect.BodyBlemishes]: {
    overlayId: OverlayType.BodyBlemish,
    options: makeList('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'),
  },
  [Aspect.Blush]: {
    overlayId: OverlayType.Blush,
    options: makeList('Classic', 'Full', 'Angled', 'Round', 'Horizontal', 'High', 'Sweetheart', 'Eighties'),
    color1: overlayColors,
  },
  [Aspect.EyeColor]: {
    options: makeList("Green", "Emerald", "Light Blue", "Ocean Blue", "Light Brown", "Dark Brown", "Hazel", "Dark Gray", "Light Gray", 'Pink', 'Yellow', 'Purple', 'Blackout', 'Shades of Gray', 'Tequila Sunrise', 'Atomic', 'Warp', 'ECola', 'Space Ranger', 'Ying Yang', 'Bullseye', 'Lizard', 'Dragon', 'Extra Terrestrial', 'Goat', 'Smiley', 'Possessed', 'Demon', 'Infected', 'Alien', 'Undead', 'Zombie'),
  },
  [Aspect.EyeMakeup]: {
    overlayId: OverlayType.Makeup,
    options: makeList('Classic', 'Smoky Black', 'Bronze', 'Soft Gray', 'Retro Glam', 'Natural Look', 'Cat Eyes', 'Chola', 'Vamp', 'Vinewood Glamour', 'Bubblegum', 'Aqua Dream', 'Pin Up', 'Purple Passion', 'Smoky Cat Eye', 'Smoldering Ruby', 'Pop Princess'),
    color1: overlayColors,
    color2: overlayColors,
  },
  [Aspect.Lipstick]: {
    overlayId: OverlayType.Lipstick,
    options: makeList('Classic', 'Color Matte', 'Color Gloss', 'Lined Matte', 'Lined Gloss', 'Heavy Lined Matte', 'Heavy Lined Gloss', 'Lined Nude Matte', 'Liner Nude Gloss', 'Smudged', 'Geisha'),
    color1: overlayColors,
    color2: overlayColors,
  },
  [Aspect.Aging]: {
    overlayId: OverlayType.Age,
    options: makeList('Classic', 'Crow\'s Feet', 'First Signs', 'Middle Aged', 'Worry Lines', 'Depression', 'Distinguished', 'Aged', 'Weathered', 'Wrinkled', 'Sagging', 'Tough Life', 'Vintage', 'Retired', 'Junkie', 'Geriatric'),
  },
  [Aspect.SkinComplextion]: {
    overlayId: OverlayType.Complexion,
    options: makeList('Classic', 'Rosy Cheeks', 'Stubble Rash', 'Hot Flush', 'Sunburn', 'Bruised', 'Alchoholic', 'Patchy', 'Totem', 'Blood Vessels', 'Damaged', 'Pale', 'Ghostly'),
  },
  [Aspect.MolesAndFreckles]: {
    overlayId: OverlayType.Freckles,
    options: makeList('Classic', 'Cherub', 'All Over', 'Irregular', 'Dot Dash', 'Over the Bridge', 'Baby Doll', 'Pixie', 'Sun Kissed', 'Beauty Marks', 'Line Up', 'Modelesque', 'Occasional', 'Speckled', 'Rain Drops', 'Double Dip', 'One Sided', 'Pairs', 'Growth'),
  },
  [Aspect.SunDamage]: {
    overlayId: OverlayType.SunDamage,
    options: makeList('Classic', 'Uneven', 'Sandpaper', 'Patchy', 'Rough', 'Leathery', 'Textured', 'Coarse', 'Rugged', 'Creased', 'Cracked', 'Gritty')
  }
} as const);

export const MAX_HAIR_COLOR = 30;
export const MAX_EYE_COLOR = 32;
export const MAX_LIPSTICK_COLOR = 32;

const randomIndex = (arrOrLength: number | any[]) => {
  const length = Array.isArray(arrOrLength) ? arrOrLength.length : arrOrLength;
  const index = (Math.random() * length) | 0;

  return Array.isArray(arrOrLength) ? arrOrLength[index] : index;
};
export const getRandomHair = (gender: 0 | 1) =>
  randomIndex(Array.from(aspects(gender)[Aspect.Hair].options.keys()));
export const getRandomHairColor = () => randomIndex(MAX_HAIR_COLOR);
export const getRandomHairHighlightColor = () => randomIndex(MAX_HAIR_COLOR);
export const getRandomEyeColor = () =>
  randomIndex(aspects()[Aspect.EyeColor].options.size);
export const getRandomBeardColor = () => randomIndex(overlayColors.length);
export const getRandomEyebrowColor = () => randomIndex(overlayColors.length);
export const getRandomBlushColor = () =>
  randomIndex(Array.from(aspects()[Aspect.Blush].options.keys()));
export const getRandomLipstickColor = () => randomIndex(MAX_LIPSTICK_COLOR);
export const getRandomChestHairColor = () => randomIndex(MAX_HAIR_COLOR);
export const getRandomOverlayColor = (overlayId: OverlayType) =>
  ((
    {
      [OverlayType.FacialHair]: getRandomBeardColor,
      [OverlayType.Eyebrows]: getRandomEyebrowColor,
      [OverlayType.Blush]: getRandomBlushColor,
      [OverlayType.Lipstick]: getRandomLipstickColor,
      [OverlayType.ChestHair]: getRandomChestHairColor,
    } as Record<OverlayType, () => number>
  )[overlayId]?.() ?? randomIndex(overlayColors.length));

export const getRandomOverlayItemValue = (overlayId: OverlayType) => {
  const aspect = Object.values(aspects()).find(
    (aspect) => "overlayId" in aspect && aspect.overlayId === overlayId
  );
  return randomIndex(Array.from(aspect!.options.keys()));
};

export const getRandomOverlayItemOpacity = (overlayId: OverlayType) => {
  const multipliers = {
    [OverlayType.Blemishes]: 0.1,
    [OverlayType.FacialHair]: 1,
    [OverlayType.Eyebrows]: 1,
    [OverlayType.Age]: 0.5,
    [OverlayType.Makeup]: 1,
    [OverlayType.Blush]: 0.6,
    [OverlayType.Complexion]: 0.6,
    [OverlayType.SunDamage]: 0.4,
    [OverlayType.Lipstick]: 1,
    [OverlayType.Freckles]: 1,
    [OverlayType.ChestHair]: 1,
    [OverlayType.BodyBlemish]: 1,
  };
  return Math.random() * multipliers[overlayId];
};
