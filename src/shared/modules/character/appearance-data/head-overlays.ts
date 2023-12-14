export const headOverlayNames = [
  "Blemishes",
  "Facial Hair",
  "Eyebrows",
  "Ageing",
  "Makeup",
  "Blush",
  "Complexion",
  "Sun Damage",
  "Lipstick",
  "Moles & Freckles",
  "Chest Hair",
];

function makeList(...items: string[]) {
  items[255] = "None";
  return new Map(
    items
      .map((value, id) => [id, value] as const)
      .filter(([, value]) => typeof value !== "undefined")
  );
}

// prettier-ignore
export const headOverlayItemNames = [
  // blemishes
  makeList('Classic', 'Measles', 'Pimples', 'Spots', 'Break Out', 'Blackheads', 'Build Up', 'Pustules', 'Zits', 'Full Acne', 'Acne', 'Cheek Rash', 'Face Rash', 'Picker', 'Puberty', 'Eyesore', 'Chin Rash', 'Two Face', 'T Zone', 'Greasy', 'Marked', 'Acne Scarring', 'Full Acne Scarring', 'Cold Sores', 'Impetigo'),
  // facial hair
  makeList('Classic', 'Light Stubble', 'Balbo', 'Circle Beard', 'Goatee', 'Chin', 'Chin Fuzz', 'Pencil Chin Strap', 'Scruffy', 'Musketeer', 'Mustache', 'Trimmed Beard', 'Stubble', 'Thin Circle Beard', 'Horseshoe', 'Pencil and \'Chops', 'Chin Strap Beard', 'Balbo and Sideburns', 'Mutton Chops', 'Scruffy Beard', 'Curly', 'Curly & Deep Stranger', 'Handlebar', 'Faustic', 'Otto & Patch', 'Otto & Full Stranger', 'Light Franz', 'The Hampstead', 'The Ambrose', 'Lincoln Curtain'),
  // eyebrows
  makeList('Classic', 'Balanced', 'Fashion', 'Cleopatra', 'Quizzical', 'Femme', 'Seductive', 'Pinched', 'Chola', 'Triomphe', 'Carefree', 'Curvaceous', 'Rodent', 'Double Tram', 'Thin', 'Penciled', 'Mother Plucker', 'Straight and Narrow', 'Natural', 'Fuzzy', 'Unkempt', 'Caterpillar', 'Regular', 'Mediterranean', 'Groomed', 'Bushels', 'Feathered', 'Prickly', 'Monobrow', 'Winged', 'Triple Tram', 'Arched Tram', 'Cutouts', 'Fade Away', 'Solo Tram'),
  // ageing
  makeList('Classic', 'Crow\'s Feet', 'First Signs', 'Middle Aged', 'Worry Lines', 'Depression', 'Distinguished', 'Aged', 'Weathered', 'Wrinkled', 'Sagging', 'Tough Life', 'Vintage', 'Retired', 'Junkie', 'Geriatric'),
  // makeup
  makeList('Classic', 'Smoky Black', 'Bronze', 'Soft Gray', 'Retro Glam', 'Natural Look', 'Cat Eyes', 'Chola', 'Vamp', 'Vinewood Glamour', 'Bubblegum', 'Aqua Dream', 'Pin Up', 'Purple Passion', 'Smoky Cat Eye', 'Smoldering Ruby', 'Pop Princess'),
  // blush
  makeList('Classic', 'Full', 'Angled', 'Round', 'Horizontal', 'High', 'Sweetheart', 'Eighties'),
  // complexion
  makeList('Classic', 'Rosy Cheeks', 'Stubble Rash', 'Hot Flush', 'Sunburn', 'Bruised', 'Alchoholic', 'Patchy', 'Totem', 'Blood Vessels', 'Damaged', 'Pale', 'Ghostly'),
  // sun damage
  makeList('Classic', 'Uneven', 'Sandpaper', 'Patchy', 'Rough', 'Leathery', 'Textured', 'Coarse', 'Rugged', 'Creased', 'Cracked', 'Gritty'),
  // lipstick
  makeList('Classic', 'Color Matte', 'Color Gloss', 'Lined Matte', 'Lined Gloss', 'Heavy Lined Matte', 'Heavy Lined Gloss', 'Lined Nude Matte', 'Liner Nude Gloss', 'Smudged', 'Geisha'),
  // freckles
  makeList('Classic', 'Cherub', 'All Over', 'Irregular', 'Dot Dash', 'Over the Bridge', 'Baby Doll', 'Pixie', 'Sun Kissed', 'Beauty Marks', 'Line Up', 'Modelesque', 'Occasional', 'Speckled', 'Rain Drops', 'Double Dip', 'One Sided', 'Pairs', 'Growth'),
  // chest hair
  makeList('Classic', 'Natural', 'The Strip', 'The Tree', 'Hairy', 'Grisly', 'Ape', 'Groomed Ape', 'Bikini', 'Lightning Bolt', 'Reverse Lightning', 'Love Heart', 'Chestache', 'Happy Face', 'Skull', 'Snail Trail', 'Slug and Nips', 'Hairy Arms'),
];

export const hiddenOverlaysForGender = (gender: 0 | 1) => {
  const forMale: number[] = [];
  const forFemale = ["Facial Hair", "Chest Hair"].map(headOverlayNames.indexOf, headOverlayNames);

  return {
    0: forMale,
    Male: forMale,
    1: forFemale,
    Female: forFemale,
  }[gender];
};

export const notRandomizableOverlaysForGender = (gender: 0 | 1) => {
  const forMale = ["Blemishes", "Makeup", "Lipstick"].map(
    headOverlayNames.indexOf,
    headOverlayNames
  );

  const forFemale = ["Facial Hair", "Ageing", "Sun Damage", "Moles & Freckles", "Chest Hair"].map(
    headOverlayNames.indexOf,
    headOverlayNames
  );

  return {
    0: forMale,
    Male: forMale,
    1: forFemale,
    Female: forFemale,
  }[gender];
};

export function isValidHeadOverlay(overlay: number) {
  return overlay >= 0 && overlay < headOverlayNames.length;
}
